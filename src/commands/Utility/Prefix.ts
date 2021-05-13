import { Message } from "discord.js";
import { Command, Flag } from "discord-akairo";
import { ArchonEmbed, DENDRO_COLOR } from "../../";

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
                            if (!message.member.hasPermission("MANAGE_GUILD")) {
                                await message.util.send(`${message.author}, you don't have permission to manage the bot prefix.`);
                                return Flag.cancel();
                            }
                            if (phrase.length > 3) {
                                await message.util.send("Prefix cannot be more than 3 characters long");
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
        const currPrefix: string = this.client.settings.get(message.guild.id, "prefix", process.env.PREFIX);

        if (newPrefix) {
            await this.client.settings.set(message.guild.id, "prefix", newPrefix);
            return message.channel.send(new ArchonEmbed()
                .setDescription(`Bot prefix has been changed from \`${currPrefix}\` to \`${newPrefix}\``)
                .setColor(DENDRO_COLOR)
            );
        } else {
            return message.util.send(new ArchonEmbed()
                .setDescription(`Bot prefix is \`${currPrefix}\``)
            );
        }
    }
}