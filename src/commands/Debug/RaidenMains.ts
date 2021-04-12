import { Message, TextChannel, MessageEmbed } from "discord.js";
import { Command, Argument } from "discord-akairo";
import rules from "../../assets/json/rules.json";
import channels from "../../assets/json/channels.json";
import roles from "../../assets/json/roles.json";
import leaderboard from "../../assets/json/leaderboard.json";

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
                    "raidenmains roles #roles",
                    "raidenmains leaderboard #leaderboard"
                ]
            },
            args: [
                {
                    id: "subcommand",
                    type: ["info", "roles", "leaderboard"],
                    prompt: {
                        start: message => `Which subcommand would you like to call? (info/roles) ${message.author}?`,
                        retry: message => `That isn't a valid subcommand! Try again ${message.author}`
                    }
                },
                {
                    id: "target",
                    type: Argument.union("newsChannel", "textChannel"),
                    prompt: {
                        start: message => `Where would you like me to send the messages to ${message.author}?`,
                        retry: message => `I can't find that channel! Try again ${message.author}`,
                        optional: true
                    },
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

    private async sendLeaderboard(target: TextChannel): Promise<void> {
        let description = "";
        for (const entry of leaderboard) {
            description += `**${entry.Discord}** - ${entry.Total}/28800\n\n`;
        }
        await target.send(new MessageEmbed()
            .setTitle("The Leaderboard")
            .setAuthor("Primogem Count", "https://media.discordapp.net/attachments/814485432959500308/822171244723830824/latest.png")
            .setDescription(description)
            .setImage("https://cdn.discordapp.com/attachments/813407840315113483/822168395738775562/New_Project_4.gif")
        );
    }

    public async exec(message: Message, { subcommand, target }: { subcommand: string, target: TextChannel }): Promise<Message> {
        switch (subcommand) {
            case "info":
                await this.sendInformation(target); break;
            case "roles":
                await this.sendRoles(target); break;
            case "leaderboard":
                await this.sendLeaderboard(target); break;
        }

        return message.channel.send(`Finished sending raiden information to ${target}`);
    }
}