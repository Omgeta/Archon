import { TextChannel, Message, MessageEmbed, User, ReactionCollector, MessageCollector } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed, partitionArray, isURL } from "../..";

type GenericCollector = ReactionCollector | MessageCollector;

interface UserData {
    previewMessage: Message;
    customText?: string;
    customEmbed: CustomizableEmbed;
    author: User;
    target: TextChannel | Message;
}

class CustomizableEmbed extends ArchonEmbed {
    public constructor(data = {}) {
        super(data);
    }

    public getProperties(): string[] {
        return ["color", "title", "url", "author", "icon", "description", "image", "thumbnail", "footer"];
    }

    public setProperty(prop, value) {
        switch (prop) {
            case "color":
                this.setColor(value); break;
            case "title":
                this.setTitle(value); break;
            case "url":
                if (isURL(value)) {
                    this.setURL(value); break;
                } else {
                    throw new TypeError("Value must be a URL");
                }
            case "author":
                this.setAuthor(value, this.author ? this.author.iconURL : ""); break;
            case "icon":
                this.setAuthor(this.author ? this.author.name : "", value); break;
            case "description":
                this.setDescription(value); break;
            case "image":
                if (isURL(value)) {
                    this.setImage(value); break;
                } else {
                    throw new TypeError("Value must be a URL");
                }
            case "thumbnail":
                if (isURL(value)) {
                    this.setThumbnail(value); break;
                } else {
                    throw new TypeError("Value must be a URL");
                }
            case "footer":
                this.setFooter(value); break;
            default:
                throw new TypeError("Invalid property");
        }
        return true;
    }
}

export default class EmbedCommand extends Command {
    private _reactionCollectors: ReactionCollector[] = [];
    private _messageCollectors: MessageCollector[] = [];
    public constructor() {
        super("embed", {
            aliases: ["embed"],
            category: "Messages",
            description: {
                content: "Send or edit embed messages",
                usage: "embed <new/edit> <target>",
                examples: [
                    "embed",
                    "embed new",
                    "embed new #general",
                    "embed edit messageID"
                ]
            },
            ratelimit: 20,
            userPermissions: ["MANAGE_GUILD"]
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

        // if (subCommand === "edit") message.channel.send("Fetching message...");
        // TODO: integrate into type

        return { target };
    }

    private toPreviewEmbed(text: string, embed: CustomizableEmbed): MessageEmbed {
        const authorName = embed.author ? embed.author.name : null;
        const authorIcon = embed.author ? embed.author.iconURL : null;
        const imageURL = embed.image ? embed.image.url : null;
        const thumbnailURL = embed.thumbnail ? embed.thumbnail.url : null;
        const footerText = embed.footer ? embed.footer.text : null;

        const fields = [
            { name: "Text", value: text ? text : "*N/A*" },
            { name: "Author", value: authorName ? authorName : "*N/A*", inline: true },
            { name: "Icon", value: authorIcon ? authorIcon : "*N/A*", inline: true },
            { name: "Color", value: embed.color ? embed.color : "*N/A*" },
            { name: "Title", value: embed.title ? embed.title : "*N/A*", inline: true },
            { name: "URL", value: embed.url ? embed.url : "*N/A*", inline: true },
            { name: "Description", value: embed.description ? embed.description : "*N/A*" },
            { name: "Image", value: imageURL ? imageURL : "*N/A*", inline: true },
            { name: "Thumbnail", value: thumbnailURL ? thumbnailURL : "*N/A*", inline: true },
            { name: "Footer", value: footerText ? footerText : "*N/A*" }
        ];

        return new ArchonEmbed()
            .addFields(fields);
    }

    private toFinalEmbed(embed: CustomizableEmbed): MessageEmbed {
        this.client.log.debug("Converting to finalEmbed");
        if (!embed.description) {
            embed.setDescription("Empty");
        }
        return embed;
    }

    private addCollector(collector: GenericCollector) {
        if (collector instanceof ReactionCollector) {
            this._reactionCollectors.push(collector);
        } else if (collector instanceof MessageCollector) {
            this._messageCollectors.push(collector);
        }
    }

    private async clearCollectors(userData: UserData) {
        const { previewMessage } = userData;

        this.client.log.debug("Clearing collectors");

        const reactionPred = (c: ReactionCollector) => { return c.message !== previewMessage; };
        const messagePred = (c: MessageCollector) => { return c.channel !== previewMessage.channel; };

        let removedReactionCollectors: ReactionCollector[] = [];
        [this._reactionCollectors, removedReactionCollectors] = partitionArray(this._reactionCollectors, reactionPred);
        removedReactionCollectors.forEach(e => e.stop());

        let removedMessageCollectors: MessageCollector[] = [];
        [this._messageCollectors, removedMessageCollectors] = partitionArray(this._messageCollectors, messagePred);
        removedMessageCollectors.forEach(e => e.stop());
    }

    private async addConfirmListener(userData: UserData) {
        const { previewMessage, author } = userData;

        await previewMessage.react("✅");
        const filter = (reaction, user) => {
            return reaction.emoji.name === "✅" && user.id === author.id;
        };
        const confirmCollector = await previewMessage.createReactionCollector(filter, { max: 1, time: 12e4 });
        await confirmCollector.on("collect", async () => {
            await this.handleConfirm(userData);
        });
        this.addCollector(confirmCollector);
        this.client.log.debug("Listening to confirm");
    }

    private async addKeyListeners(userData: UserData) {
        const { previewMessage, customText, customEmbed, author } = userData;

        const keys = customEmbed.getProperties();
        const firstToken = (msg) => {
            return msg.content.split(" ")[0].toLowerCase();
        };
        const filter = (msg) => {
            return msg.author.id === author.id && [...keys, "text", "json"].includes(firstToken(msg));
        };
        const keyCollector = await previewMessage.channel.createMessageCollector(filter, { max: 1, time: 6e4 });
        await keyCollector.on("collect", async m => {
            const key = firstToken(m);
            await previewMessage.edit(this.toPreviewEmbed(customText, customEmbed)
                .setDescription(`__**Modifying ${key}**__`)
            );
            this.addValueListeners(userData, key);
        });
        this.addCollector(keyCollector);
        this.client.log.debug("Listening to keys");
    }

    private async addValueListeners(userData: UserData, key: string) {
        const { previewMessage, author } = userData;

        const filter = (msg) => {
            return msg.author.id === author.id;
        };
        const valueCollector = await previewMessage.channel.createMessageCollector(filter, { max: 1, time: 6e4 });
        await valueCollector.on("collect", async m => {
            const value = m.content;
            await this.handleAssignment(userData, key, value);
        });
        this.addCollector(valueCollector);
        this.client.log.debug("Listening to values.");
    }

    private async handleConfirm(userData: UserData) {
        const { previewMessage, customEmbed, target } = userData;
        const { customText } = userData;

        this.client.log.debug("Handling confirm");
        const finalEmbed = this.toFinalEmbed(customEmbed);
        if (target instanceof TextChannel) {
            this.client.log.debug("Sending message to target channel");
            target.send(customText, { embed: finalEmbed });
        } else if (target instanceof Message) {
            this.client.log.debug("Editing message to embed");
            target.edit(customText, { embed: finalEmbed });
        }
        await previewMessage.reactions.removeAll();
        await this.clearCollectors(userData);
    }

    private async handleAssignment(userData: UserData, key: string, value: string) {
        const { previewMessage } = userData;

        try {
            this.client.log.debug(`Setting ${key} to ${value}`);
            if (key === "text") {
                userData.customText = value;
            } else if (key === "json") {
                userData.customEmbed = new CustomizableEmbed(JSON.parse(value));
            } else {
                userData.customEmbed.setProperty(key, value);
            }
            await previewMessage.reactions.removeAll();
            previewMessage.edit(this.toPreviewEmbed(userData.customText, userData.customEmbed));
        } catch (err) {
            previewMessage.channel.send(new ArchonEmbed()
                .setDescription(`\`${key}\` cannot be set to \`${value}\``)
            );
        }
        await this.clearCollectors(userData);
        this.init(userData);
    }

    private init(userData: UserData) {
        this.addConfirmListener(userData);
        this.addKeyListeners(userData);
    }

    public async exec(message: Message, { target }: { target: TextChannel | Message }): Promise<void> {
        const { author } = message;
        const loadData = target instanceof Message ? target.embeds[0] : undefined;
        const customEmbed = new CustomizableEmbed(loadData);
        let customText: string;
        const previewMessage = await message.channel.send(this.toPreviewEmbed(customText, customEmbed));

        const userData: UserData = {
            previewMessage,
            customText,
            customEmbed,
            author,
            target
        };
        this.init(userData);
    }
}