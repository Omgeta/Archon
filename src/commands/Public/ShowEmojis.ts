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

    // TODO: change arg to "emojis" and use collection instead of array for emojis
    public async exec(message: Message, { emojis }: { emojis: GuildEmoji[] }): Promise<void> {
        const results = [...new Set(emojis)].map(e => `**Name:** ${e} **Image:** ${e.url}`);
        console.log(results);

        for (let i = 0; i < Math.ceil(results.length / 5); i++) {
            await message.channel.send(results.slice(i * 5, i * 5 + 5).join("\n"));
        }
    }
}