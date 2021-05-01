import { Message, TextChannel, MessageEmbed, NewsChannel } from "discord.js";
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

    private async sendInformation(target: NewsChannel | TextChannel): Promise<void> {
        for (const embed of rules) {
            await target.send(new MessageEmbed(embed));
        }

        for (const embed of channels) {
            await target.send(new MessageEmbed(embed));
        }
    }

    private async sendRoles(target: NewsChannel | TextChannel): Promise<void> {
        for (const embed of roles) {
            await target.send(new MessageEmbed(embed));
        }
    }

    private async sendLeaderboard(target: NewsChannel | TextChannel): Promise<void> {
        let description = "";
        for (const entry of leaderboard) {
            description += `${entry.Ranking}. **${entry.Discord}** - ${entry.Total}/28800\n\n`;
        }
        await target.send(new MessageEmbed()
            .setAuthor("", "https://images-ext-1.discordapp.net/external/AefdtAO-E2pokACMM5WuBjMOggFGEgilOrpYumSa5ik/https/media.discordapp.net/attachments/814485432959500308/822171244723830824/latest.png")
            .setTitle("__**Leaderboard | Primogem Count**__")
            .setDescription("\u200B\u200B" + description)
            .setImage("https://media1.tenor.com/images/2aeac774a8d2dad2e2086f6326429a2a/tenor.gif")
        );
    }

    public async exec(message: Message, { subcommand, target }: { subcommand: string, target: NewsChannel | TextChannel }): Promise<Message> {
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