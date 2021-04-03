import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";

export default class ReadChannelCommand extends Command {
    public constructor() {
        super("readchannel", {
            aliases: ["readchannel"],
            category: "Debug",
            description: {
                content: "Read channel contents",
                usage: "readchannel <channelid>",
                examples: [
                    "readchannel 123"
                ]
            },
            args: [
                {
                    id: "target",
                    type: "string"
                },
                {
                    id: "number",
                    type: "integer",
                    default: 10
                }
            ],
            ratelimit: 3,
            ownerOnly: true,
            typing: true
        });
    }

    public async exec(message: Message, { target, number }: { target: string, number: number }): Promise<Message> {
        try {
            const channel = await this.client.channels.cache.get(target);
            const messages = await (channel as TextChannel).messages.fetch({ limit: number });
            for (const msg of messages.array().reverse()) {
                await message.channel.send(`${msg.author.username}: ${msg.content} ${msg.attachments.array()[0] ? msg.attachments.array()[0].url : ""}`);
            }

        } catch (err) {
            return message.channel.send("Failed to execute. Try again!");
        }
    }
}