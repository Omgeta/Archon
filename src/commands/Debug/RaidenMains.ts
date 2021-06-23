import { Message, TextChannel, MessageEmbed, NewsChannel } from "discord.js";
import { Command, Argument } from "discord-akairo";
import rules from "../../assets/json/rules.json";
import channels from "../../assets/json/channels.json";
import roles from "../../assets/json/roles.json";
import lyceum from "../../assets/json/lyceum.json";
import { ArchonEmbed } from "../../";

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
                    type: ["info", "roles", "leaderboard", "lyceum"],
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
            userPermissions: ["ADMINISTRATOR"],
            typing: true,
            ratelimit: 3
        });
    }

    private async sendInformation(target: NewsChannel | TextChannel): Promise<void> {
        let first: Message;
        for (const embed of rules) {
            const msg = await target.send(new MessageEmbed(embed));
            if (!first) first = msg;
        }

        for (const embed of channels) {
            await target.send(new MessageEmbed(embed));
        }

        await target.send(new MessageEmbed()
            .setDescription(
                `
                We hope you have a fun experience in our server! 
                If you're having any trouble, please report it to a <@&811959425824587826> or a <@&801133647485730896>.

                Click **[here](${first.url})** to jump to the start of this channel.
                `
            )
            .setColor("#00bb00")
        );
    }

    private async sendRoles(target: NewsChannel | TextChannel): Promise<void> {
        for (const embed of roles) {
            await target.send(new MessageEmbed(embed));
        }
    }

    private async sendLyceum(target: NewsChannel | TextChannel): Promise<void> {
        let first: Message;
        for (const embed of lyceum) {
            const msg = await target.send(new MessageEmbed(embed));
            if (!first) first = msg;
        }
        await target.send(new MessageEmbed()
            .setDescription(
                `
                We hope you have an enlightening experience in the Lyceum!
                Please remember to always stay on-topic here.
                If you're having any trouble, please report it to a <@&845638574983741460> or a <@&811959425824587826>.

                Click **[here](${first.url})** to jump to the start of this channel.
                `
            )
            .setColor("#00bb00")
        );
    }

    private async sendLeaderboard(target: NewsChannel | TextChannel): Promise<void> {
        const description = this.client.leaderboard.toString();
        await target.send(new ArchonEmbed()
            .setAuthor("", "https://images-ext-1.discordapp.net/external/AefdtAO-E2pokACMM5WuBjMOggFGEgilOrpYumSa5ik/https/media.discordapp.net/attachments/814485432959500308/822171244723830824/latest.png")
            .setTitle("__**Leaderboard | Primogem Count**__")
            .setDescription(description)
            .setImage("https://i.imgur.com/Lqf51wQ.gif")
        );
    }

    public async exec(message: Message, { subcommand, target }: { subcommand: string, target: NewsChannel | TextChannel }): Promise<Message> {
        switch (subcommand) {
            case "info":
                await this.sendInformation(target); break;
            case "roles":
                await this.sendRoles(target); break;
            case "lyceum":
                await this.sendLyceum(target); break;
            case "leaderboard":
                await this.sendLeaderboard(target); break;
        }

        return message.channel.send(`Finished sending raiden information to ${target}`);
    }
}