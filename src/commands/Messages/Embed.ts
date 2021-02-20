import { TextChannel, Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

export default class EmbedCommand extends Command {
    public constructor() {
        super("embed", {
            aliases: ["embed", "emb"],
            category: "Messages",
            description: {
                content: "Send or edit embed messages",
                usage: "embed <subcommand> <target>",
                examples: [
                    "embed",
                    "embed new",
                    "embed new #general",
                    "embed edit messageID"
                ]
            },
            ratelimit: 3,
            userPermissions: ["MANAGE_MESSAGES"],
            channel: "guild"
        });
    }

    private *args(message: Message) {
        const subCommand = yield { type: ["new", "edit"], default: "new" };
        if (subCommand === "edit") message.channel.send("Fetching message...");
        const target = yield (subCommand === "new") ? { type: "textChannel", default: message => message.channel } : { type: "guildMessage" };

        return { subCommand, target };
    }

    public async exec(message: Message, { subCommand, target }: { subCommand: string, target: TextChannel | Message }): Promise<Message> {
        const newEmbed = (subCommand === "new") ? new MessageEmbed() : new MessageEmbed((target as Message).embeds[0]);

        // Filters
        const userFilter = (user) => { return user.id === message.author.id; };
        const confirmFilter = (reaction, user) => { return reaction.emoji.name === "✅" && userFilter(user); };
        const fieldFilter = (response) => { return ["title", "description", "url", "image", "thumbnail", "color"].includes(response.content.toLowerCase()) && userFilter(response.author); };
        const httpsFilter = (response) => { return response.content.startsWith("https://") && userFilter(response.author); };
        const hexFilter = (response) => { return response.content.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/) && userFilter(response.author); };
        const stringFilter = (response) => { return true && userFilter(response.author); };

        // TODO: Someone please fix this code
        let completed = false;
        while (!completed) {
            const previewEmbed = new MessageEmbed()
                .setTitle("__Preview__")
                .setColor(newEmbed.color)
                .addFields(
                    { name: "Title", value: newEmbed.title ? newEmbed.title : "-" },
                    { name: "URL", value: newEmbed.url ? newEmbed.url : "-" },
                    { name: "Description", value: newEmbed.description ? newEmbed.description : "-" },
                    { name: "Thumbnail", value: newEmbed.thumbnail ? newEmbed.thumbnail.url : "-" },
                    { name: "Image", value: newEmbed.image ? newEmbed.image.url : "-" }
                )
                .setFooter("*Type field names to modify them*");
            const previewMessage = await message.channel.send(previewEmbed);

            await previewMessage.react("✅");
            const confirmCollector = await previewMessage.createReactionCollector(confirmFilter, { max: 1, time: 6e4 });
            confirmCollector.on("collect", () => {
                completed = true;
                return (subCommand === "new") ? (target as TextChannel).send(newEmbed) : (target as Message).edit(newEmbed);
            });

            try {
                const fieldCollector = await previewMessage.channel.awaitMessages(fieldFilter, { max: 1, time: 6e4 });
                const fieldName = fieldCollector.first().content.toLowerCase();

                await previewMessage.channel.send(`Enter a value to set ${fieldName} to...`);

                const valueFilter = (["image", "thumbnail", "url"].includes(fieldName)) ? httpsFilter : ((fieldName === "color" ? hexFilter : stringFilter));
                const collectedValue = await previewMessage.channel.awaitMessages(valueFilter, { max: 1, time: 3e4 });

                const value = collectedValue.first().content;
                if (["image", "thumbnail"].includes(fieldName)) newEmbed[fieldName].url = value;
                else newEmbed[fieldName] = value;
            } catch (err) {
                if (!completed) { return message.channel.send("Embed construction timed out"); }
            }

            confirmCollector.stop();
        }
    }
}