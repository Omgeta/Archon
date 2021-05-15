import { TextChannel, Message, MessageEmbed, User } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../../";

interface EmbedDetails {
    color?: string;
    author?: string;
    icon?: string;
    title?: string;
    url?: string;
    description?: string;
    image?: string;
    thumbnail?: string;
    footer?: string;
}

export default class EmbedCommand extends Command {
    public constructor() {
        super("embed2", {
            aliases: ["embed2"],
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
            lock: "user",
            ownerOnly: true
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

    private toPreviewEmbed(embed: EmbedDetails): MessageEmbed {
        const fields = [
            { name: "Color", value: embed.color ? embed.color : "*N/A*", inline: true },
            { name: "Author", value: embed.author ? embed.author : "*N/A*", inline: true },
            { name: "Icon", value: embed.icon ? embed.icon : "*N/A*", inline: true },
            { name: "Title", value: embed.title ? embed.title : "*N/A*", inline: true },
            { name: "URL", value: embed.url ? embed.url : "*N/A*", inline: true },
            { name: "Description", value: embed.description ? embed.description : "*N/A*", inline: true },
            { name: "Image", value: embed.image ? embed.image : "*N/A*", inline: true },
            { name: "Thumbnail", value: embed.thumbnail ? embed.thumbnail : "*N/A*", inline: true },
            { name: "Footer", value: embed.footer ? embed.footer : "*N/A*", inline: true }
        ];

        return new ArchonEmbed()
            .addFields(fields);
    }

    private toFinalEmbed(embed: EmbedDetails): MessageEmbed {
        const transformedEmbed = {
            color: embed.color,
            title: embed.title,
            url: embed.url,
            author: {
                name: embed.author,
                icon_url: embed.icon
            },
            description: embed.description ? embed.description : "Empty",
            thumbnail: {
                url: embed.thumbnail
            },
            footer: {
                text: embed.footer
            }
        };

        return new ArchonEmbed(transformedEmbed);
    }

    private async addConfirmListener(message: Message, embed: EmbedDetails, author: User, target: TextChannel | Message) {
        await message.react("✅");

        const filter = (reaction, user) => {
            return reaction.emoji.name === "✅" && user.id === author.id;
        };

        const confirmCollector = await message.createReactionCollector(filter, { max: 1, time: 6e4 });
        confirmCollector.on("collect", () => {
            this.handleConfirm(embed, target);
        });
    }

    private async addKeyListeners(message: Message, embed: EmbedDetails) {
        // PASS
    }

    private handleConfirm(embed: EmbedDetails, target: TextChannel | Message) {
        const finalEmbed = this.toFinalEmbed(embed);
        if (target instanceof TextChannel) {
            target.send(finalEmbed);
        } else if (target instanceof Message) {
            target.edit(finalEmbed);
        }
    }

    private handleKey(embed: EmbedDetails, key: string, value: string) {
        // filter for certain keys
        // set value
    }

    public async exec(message: Message, { subCommand, target }: { subCommand: string, target: TextChannel | Message }): Promise<void> {
        const workingEmbed: EmbedDetails = {};

        const previewMessage = await message.channel.send(this.toPreviewEmbed(workingEmbed));
        this.addConfirmListener(previewMessage, workingEmbed, message.author, target);
        this.addKeyListeners(previewMessage, workingEmbed);
    }
}