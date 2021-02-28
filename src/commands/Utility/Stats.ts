import { Message } from "discord.js";
import { Command } from "discord-akairo";

export default class StatsCommand extends Command {
    public constructor() {
        super("stats", {
            aliases: ["stats"],
            category: "Utility",
            description: {
                content: "View the bot and server statistics",
                usage: "stats",
                examples: [
                    "stats"
                ]
            },
            ratelimit: 3
        });
    }

    public exec(message: Message): Promise<Message> {
        return message.util.send(`Pong! \`${this.client.ws.ping} ms\``);
    }
}