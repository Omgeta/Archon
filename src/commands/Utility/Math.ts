import { Message } from "discord.js";
import { Command } from "discord-akairo";
import mexp from "math-expression-evaluator";

export default class MathCommand extends Command {
    public constructor() {
        super("math", {
            aliases: ["math", "eval", "calc"],
            category: "Utility",
            description: {
                content: "Evaluate math expressions.",
                usage: "math <expression>",
                examples: [
                    "math 1+2",
                    "math 2^3",
                    "math tan45",
                    "math Sigma(1,15,n)",
                    "math 5P3"
                ]
            },
            args: [
                {
                    id: "expr",
                    type: "string",
                    match: "rest"
                }
            ],
            ratelimit: 3
        });
    }

    public exec(message: Message, { expr }: { expr: string }): Promise<Message> {
        let value;
        try {
            value = mexp.eval(expr);
        } catch (e) {
            this.client.log.warn(`${message.author.tag} (${message.author.id}) called invalid math expression ${expr}`);
            return message.reply(`Invalid math expression: ${e.message}`);
        }
        return message.util.reply(value.toString());
    }
}
