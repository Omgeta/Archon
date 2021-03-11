import { Message } from "discord.js";
import { Command, Argument } from "discord-akairo";

export default class JSONCommand extends Command {
    public constructor() {
        super("json", {
            aliases: ["json"],
            category: "Debug",
            description: {
                content: "Get the json data of a discord object",
                usage: "json <object>",
                examples: [
                    "json 123",
                    "json #general",
                    "json @User"
                ]
            },
            args: [
                {
                    id: "target",
                    type: Argument.union("relevant", "channel", "role", "emoji", "guildMessage")
                }
            ],
            ratelimit: 3,
            ownerOnly: true,
            typing: true
        });
    }

    public async exec(message: Message, { target }: { target: unknown }): Promise<Message> {
        return message.util.send(`\`\`\`json\n${JSON.stringify(target, null, 2)}\`\`\``);
    }
}