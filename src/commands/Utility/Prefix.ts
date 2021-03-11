import { Message } from "discord.js";
import { Command, Flag } from "discord-akairo";
import { prefix } from "../../Config";

export default class PrefixCommand extends Command {
    public constructor() {
        super("prefix", {
            aliases: ["prefix"],
            category: "Utility",
            description: {
                content: "Check or set the bot's prefix'",
                usage: "prefix <new_prefix>",
                examples: [
                    "prefix",
                    "prefix !"
                ]
            },
            args: [
                {
                    id: "newPrefix",
                    type: async (message, phrase) => {
                        if (phrase) {
                            if (phrase.length > 3) {
                                await message.util.send("Prefix cannot be more than 3 characters long");
                                return Flag.cancel();
                            }
                            if (!message.member.hasPermission("MANAGE_GUILD")) {
                                await message.util.send(`${message.author}, you don't have permission to manage this bots' prefix.`);
                                return Flag.cancel();
                            }

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