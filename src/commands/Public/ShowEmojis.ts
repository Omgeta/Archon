import { Message, GuildEmoji } from "discord.js";
import { Command } from "discord-akairo";

export default class ShowEmojisCommand extends Command {
    public constructor() {
        super("showemojis", {
            aliases: ["showemojis", "semojis", "se"],
            category: "Public",
            description: {
                content: "Show all special emojis",
                usage: "showemoji <emoji>",
                examples: [
                    "showemoji :emoji1: :emoji2:"
                ]
            },
            args: [
                {
                    id: "emojis",
                    type: "emoji",
                    match: "separate"
                }
            ],
            ratelimit: 3,
            channel: "guild"
        });
    }

    public async exec(message: Message, { emojis }: { emojis: GuildEmoji[] }): Promise<void> {
        const results = [...new Set(emojis)].map(e => `**Name:** ${e} **Image:** ${e.url}`);

        // Send a message for every 5 emojis
        const N = 5;
        const divisions = Math.floor((results.length + N - 1) / N);
        for (let i = 0; i < divisions; i++) {
            const content: string = results.slice(i * N, (i + 1) * N).join("\n");
            await message.channel.send(content);
        }
    }
}