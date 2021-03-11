import { Message, TextChannel, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import rules from "../../assets/json/rules.json";
import channels from "../../assets/json/channels.json";
import roles from "../../assets/json/roles.json";

export default class RaidenMainsCommand extends Command {
    public constructor() {
        super("raidenmains", {
            aliases: ["raidenmains"],
            category: "Debug",
            description: {
                content: "Set up RaidenMains directory channels",
                usage: "raidenmains <subcommand> <channel>",
                examples: [
                    "raidenmains info #rules",
                    "raidenmains roles #roles"
                ]
            },
            args: [
                {
                    id: "subcommand",
                    type: ["info", "roles"],
                    default: "info"
                },
                {
                    id: "target",
                    type: "textChannel",
                    default: message => message.channel
                }
            ],
            ownerOnly: true,
            typing: true,
            ratelimit: 3
        });
    }

    private async sendInformation(target: TextChannel): Promise<void> {
        for (const embed of rules) {
            await target.send(new MessageEmbed(embed));
        }

        for (const embed of channels) {
            await target.send(new MessageEmbed(embed));
        }
    }

    private async sendRoles(target: TextChannel): Promise<void> {
        for (const embed of roles) {
            await target.send(new MessageEmbed(embed));
        }
    }

    public async exec(message: Message, { subcommand, target }: { subcommand: string, target: TextChannel }): Promise<Message> {
        if (subcommand === "info") {
            await this.sendInformation(target);
        } else if (subcommand === "roles") {
            await this.sendRoles(target);
        }

        return message.channel.send(`Finished sending raiden information to ${target}`);
    }
}