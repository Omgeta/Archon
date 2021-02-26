import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { prefix } from "../../Config";

export default class PrefixCommand extends Command {
    public constructor() {
        super("prefix", {
            aliases: ["prefix"],
            category: "Utility",
            description: {
                content: "Check or set the bot's prefix'",
                usage: "prefix <new-prefix>",
                examples: [
                    "prefix",
                    "prefix !"
                ]
            },
            args: [
                {
                    id: "newPrefix",
                    type: (message, phrase) => {
                        if (phrase && message.member.hasPermission("MANAGE_GUILD")) {
                            return phrase;
                        }
                        return null;
                    }
                }
            ],
            channel: "guild",
            ratelimit: 3
        });
    }

    public async exec(message: Message, { newPrefix }: { newPrefix: string }): Promise<Message> {
        const oldPrefix = this.client.settings.get(message.guild.id, "prefix", prefix);

        if (newPrefix) {
            await this.client.settings.set(message.guild.id, "prefix", newPrefix);
            return message.util.send(`Prefix has been changed from \`${oldPrefix}\` to \`${newPrefix}\``);
        } else {
            return message.util.send(`Current bot prefix is \`${oldPrefix}\``);
        }
    }
}