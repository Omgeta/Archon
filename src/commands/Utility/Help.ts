import { Message, PermissionResolvable } from "discord.js";
import { Command, Flag } from "discord-akairo";
import { ArchonEmbed } from "../../";

export default class HelpCommand extends Command {
    public constructor() {
        super("help", {
            aliases: ["help", "commands", "cmds"],
            category: "Utility",
            description: {
                content: "Check how to use the different commands",
                usage: "help <command>",
                examples: [
                    "help",
                    "help ping"
                ]
            },
            args: [
                {
                    id: "command",
                    type: async (message, phrase) => {
                        if (phrase) {
                            const toCommand = this.handler.resolver.type("commandAlias");
                            const command: Command = toCommand(message, phrase);
                            if (!command || !message.member.hasPermission(command.userPermissions as PermissionResolvable[])) {
                                await message.util.send(`No such command \`${phrase}\` found`);
                                return Flag.cancel();
                            }

                            return command;
                        }
                    }
                }
            ],
            ratelimit: 3
        });
    }

    public exec(message: Message, { command }: { command: Command }): Promise<Message> {
        const guildPrefix = this.client.settings.get(message.guild.id, "prefix", process.env.PREFIX);

        if (command) {
            return message.util.send(new ArchonEmbed()
                .setTitle(`__**Help | ${command}**__`)
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
                .setTitle("__**Help**__")
                .setFooter(`${guildPrefix}${this.description.usage} for more information on a specific command`);

            for (const category of this.handler.categories.values()) {
                if (category.id === "default") continue;

                embed.addField(category.id, category
                    .filter(cmd => cmd.aliases.length > 0 && message.member.hasPermission(cmd.userPermissions as PermissionResolvable[]) && !cmd.ownerOnly)
                    .map(cmd => `\`${cmd}\``)
                    .join(", " || "*No commands in this category*"), true
                );
            }

            return message.util.send(embed);
        }
    }
}