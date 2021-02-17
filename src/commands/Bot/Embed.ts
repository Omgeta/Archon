import { Command } from "discord-akairo";
import { TextChannel, Message, MessageEmbed } from "discord.js";

export default class EmbedCommand extends Command {
    public constructor() {
        super("embed", {
            aliases: ["embed", "emb"],
            category: "Admin",
            description: {
                content: "Send or edit embed messages",
                usage: "embed < subcommand > < target >",
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

    private *args() {
        const subCommand = yield { type: ["new", "edit"], default: "new" };
        const target = yield (subCommand === "new") ? { type: "textChannel", default: message => message.channel } : { type: "guildMessage" };

        return { subCommand, target };
    }

    public async exec(message: Message, { subCommand, target }: { subCommand: string, target: TextChannel | Message }): Promise<Message> {
        const newEmbed = (subCommand === "new") ? new MessageEmbed() : new MessageEmbed((target as Message).embeds[0]);

        // Filters
        const confirmFilter = (reaction, user) => { return reaction.emoji.name === "✅"; };
        const fieldFilter = (message, user) => { return ["title", "description", "url", "image", "thumbnail", "color"].includes(message.content.toLowerCase()); };
        const httpsFilter = (message, user) => { return message.content.startsWith("https://"); };
        const hexFilter = (message, user) => { return message.content.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/); };
        const stringFilter = (message, user) => { return true; };

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
                const fieldName = fieldCollector.first().content;

                await previewMessage.channel.send(`Enter a value to set ${fieldName} to...`);

                const valueFilter = (["image", "thumbnail", "url"].includes(fieldName)) ? httpsFilter : ((fieldName === "color" ? hexFilter : stringFilter));
                const collectedValue = await previewMessage.channel.awaitMessages(valueFilter, { max: 1, time: 3e4 });

                const value = collectedValue.first().content;
                if (["image", "thumbnail"].includes(fieldName)) newEmbed[fieldName].url = value;
                else newEmbed[fieldName] = value;
            } catch (err) {
                if (!completed) { return message.channel.send("Embed construction timed out"); }
            }

        }
    }
}