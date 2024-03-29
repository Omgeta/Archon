import { Message, TextChannel, MessageEmbed, NewsChannel } from "discord.js";
import { Command, Argument } from "discord-akairo";
import rules from "../../assets/json/rules.json";
import channels from "../../assets/json/channels.json";
import roles from "../../assets/json/roles.json";
import lyceum from "../../assets/json/lyceum.json";
import faq from "../../assets/json/faq.json";
import { ArchonEmbed, LeaderboardManager } from "../../";

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
                    type: ["info", "roles", "leaderboard", "lyceum", "faq"],
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
        for (const embed of lyceum) {
            await target.send(new MessageEmbed(embed));
        }
    }

    private async sendFAQ(target: NewsChannel | TextChannel): Promise<void> {
        let first: Message;
        let firstData: MessageEmbed;
        const body: Message[] = [];
        const bodyData: MessageEmbed[] = [];
        for (const embed of faq) {
            const data = new ArchonEmbed(embed);
            const msg = await target.send(data);
            if (!first) {
                first = msg;
                firstData = data;
            } else {
                body.push(msg);
                bodyData.push(data);
            }
        }

        const bodyLinks = body.map(m => m.url);
        const bodyString = bodyData.map((e, i) => `${i + 1}. [${e.title.replaceAll("*", "")}](${bodyLinks[i]})`);
        const half = Math.ceil(bodyString.length / 2);
        const firstHalf = bodyString.slice(0, half).join("\n");
        const secondHalf = bodyString.slice(-half).join("\n");

        const newData = firstData.addFields(
            { name: "Contents", value: firstHalf, inline: true },
            { name: "\u200b", value: secondHalf, inline: true }
        );

        await first.edit(newData);
    }

    private async sendLeaderboardEmbed(target: NewsChannel | TextChannel, categoryTitle: string, embedDescription: string, color: string, i: number) {
        const newEmbed = new ArchonEmbed()
            .setTitle(`__**${categoryTitle} ${i ? "cont." : ""}**__`)
            .setDescription(embedDescription)
            .setColor(color);
        await target.send(newEmbed);
    }

    private async sendLeaderboardCategories(target: NewsChannel | TextChannel, categoryTitle: string, categoryDescription: string, color: string) {
        const descSections = categoryDescription.split("\n\n");

        let i = 0;
        let c = 0;
        let tempSubarr = [];
        while (descSections.length) {
            if (descSections[0].length + 2 <= 4096) {
                c += descSections[0].length + 2;
                if (c > 4096) {
                    await this.sendLeaderboardEmbed(target, categoryTitle, tempSubarr.join("\n\n"), color, i);
                    i++;
                    c = 0;
                    tempSubarr = [];
                } else {
                    tempSubarr.push(descSections.shift());
                }
            } else {
                const arr = descSections.shift().split("\n");
                const half = Math.ceil(arr.length / 2);
                const firstHalf = arr.splice(0, half).join("\n");
                const secondHalf = arr.splice(-half).join("\n");
                descSections.unshift(firstHalf, secondHalf);
            }
        }
        await this.sendLeaderboardEmbed(target, categoryTitle, tempSubarr.join("\n\n"), color, i);
    }

    private async sendLeaderboard(target: NewsChannel | TextChannel): Promise<void> {
        const leaderboardManager = new LeaderboardManager(this.client);
        const [paidCategory, freeCategory] = leaderboardManager.getCategories();

        await this.sendLeaderboardCategories(
            target,
            "Primogem Leaderboard | Whale/Dolphin Category",
            LeaderboardManager.toString(paidCategory),
            "#DD2233"
        );

        await this.sendLeaderboardCategories(
            target,
            "Primogem Leaderboard | F2P+ Category",
            LeaderboardManager.toString(freeCategory),
            "#800080"
        );
    }

    public async exec(message: Message, { subcommand, target }: { subcommand: string, target: NewsChannel | TextChannel }): Promise<Message> {
        switch (subcommand) {
            case "info":
                await this.sendInformation(target); break;
            case "roles":
                await this.sendRoles(target); break;
            case "faq":
                await this.sendFAQ(target); break;
            case "lyceum":
                await this.sendLyceum(target); break;
            case "leaderboard":
                await this.sendLeaderboard(target); break;
        }


        return message.channel.send(`Finished sending raiden information to ${target}`);
    }
}