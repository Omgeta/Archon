import { Message } from "discord.js";
import { Command } from "discord-akairo";

export default class EmbedJSONCommand extends Command {
    public constructor() {
        super("embedjson", {
            aliases: ["embedjson"],
            category: "Debug",
            description: {
                content: "Get JSON data from embeds",
                usage: "embedjson <message>",
                examples: [
                    "embedjson 123"
                ]
            },
            args: [
                {
                    id: "target",
                    type: "message"
                }
            ],
            userPermissions: ["ADMINISTRATOR"],
            typing: true,
            ratelimit: 3
        });
    }

    public async exec(message: Message, { target }: { target: Message }): Promise<Message> {
        if (target.embeds.length > 0) {
            return message.channel.send(`\`\`\`json\n${JSON.stringify(target.embeds, (k, v) => {
                if (v !== null) return v;
            }, 2)}\`\`\``);
        }
    }
}