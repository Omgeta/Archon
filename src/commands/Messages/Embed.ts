import { TextChannel, Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";

export default class EmbedCommand extends Command {
    public constructor() {
        super("embed", {
            aliases: ["embed"],
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
            channel: "guild",
            lock: "user"
        });
    }

    private *args(message: Message) {
        const subCommand = yield {
            type: ["new", "edit"],
            prompt: {
                start: `Would you like to create a new embed or edit an existing one? (new/edit) ${message.author}`,
                retry: `That isn't a valid subcommand! Try again ${message.author}`
            }
        };


        const target = yield (subCommand === "new") ?
            {
                type: "channel",
                prompt: {
                    start: `Which channel do you want to send the message to ${message.author}?`,
                    retry: `I can't find that channel! Try again ${message.author}`,
                    optional: true
                },
                default: message => message.channel
            } :
            {
                type: "guildMessage",
                prompt: {
                    start: `Which message do you want to edit ${message.author}?`,
                    retry: `I can't find that message! Try again ${message.author}`
                }
            };

        if (subCommand === "edit") message.channel.send("Fetching message...");

        return { subCommand, target };
    }

    public async exec(message: Message, { subCommand, target }: { subCommand: string, target: TextChannel | Message }): Promise<Message> {
        let newEmbed = (subCommand === "new") ? new MessageEmbed() : new MessageEmbed((target as Message).embeds[0]);

        // Filters
        const userFilter = (user) => { return user.id === message.author.id; };
        const confirmFilter = (reaction, user) => { return reaction.emoji.name === "✅" && userFilter(user); };
        const fieldFilter = (response) => { return ["author", "icon", "title", "description", "url", "image", "thumbnail", "color", "load"].includes(response.content.toLowerCase()) && userFilter(response.author); };
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
                    { name: "Author", value: newEmbed.author ? newEmbed.author.name : "-" },
                    { name: "Icon", value: newEmbed.author ? newEmbed.author.iconURL : "-" },
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

                const valueFilter = (["image", "thumbnail", "url", "icon"].includes(fieldName)) ? httpsFilter : ((fieldName === "color" ? hexFilter : stringFilter));
                const collectedValue = await previewMessage.channel.awaitMessages(valueFilter, { max: 1, time: 3e4 });

                const value = collectedValue.first().content;

                if (fieldName === "load") newEmbed = new MessageEmbed(JSON.parse(value));
                else if (fieldName === "image") newEmbed.image ? newEmbed.image.url = value : newEmbed.setImage(value);
                else if (fieldName === "thumbnail") newEmbed.thumbnail ? newEmbed.thumbnail.url = value : newEmbed.setThumbnail(value);
                else if (fieldName === "icon") newEmbed.author ? newEmbed.author.iconURL = value : newEmbed.setAuthor(null, value);
                else if (fieldName === "author") newEmbed.author ? newEmbed.author.name = value : newEmbed.setAuthor(value, null);
                else newEmbed[fieldName] = value;
            } catch (err) {
                console.log(err);
                if (!completed) { return message.channel.send("Embed construction timed out"); }
            }

            confirmCollector.stop();
        }
    }
}