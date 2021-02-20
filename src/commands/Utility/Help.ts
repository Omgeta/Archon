import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../../";

export default class HelpCommand extends Command {
    public constructor() {
        super("help", {
            aliases: ["help", "commands", "cmds"],
            category: "Utility",
            description: {
                content: "Check how to use the different commands",
                usage: "help <commandname>",
                examples: [
                    "help",
                    "help ping"
                ]
            },
            args: [
                {
                    id: "command",
                    type: "commandAlias",
                    default: null
                }
            ],
            ratelimit: 3
        });
    }

    public exec(message: Message, { command }: { command: Command }): Promise<Message> {
        if (command) {
            return message.util.send(new ArchonEmbed()
                .setTitle(`Help || ${command}`)
                .setDescription(
                    `
                    **Description:**
                    ${command.description.content || "*No description available*"}

                    **Usage:**
                    ${"`" + command.description.usage + "`" || "*No usage available*"}

                    **Examples:**
                    ${command.description.examples ? command.description.examples.map(e => `\`${e}\``).join("\n") : "*No examples available*"}
                    `
                )
            );
        } else {
            const embed = new ArchonEmbed()
                .setTitle("Help")
                .setFooter(`${this.client.commandHandler.prefix}${this.description.usage} for more information on a specific command`);

            for (const category of this.handler.categories.values()) {
                if (["default"].includes(category.id)) continue;

                embed.addField(category.id, category
                    .filter(cmd => cmd.aliases.length > 0)
                    .map(cmd => `\`${cmd}\``)
                    .join(", " || "*No commands in this category*"), true
                );
            }

            return message.util.send(embed);
        }
    }
}