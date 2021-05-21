import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import * as partners from "../../assets/json/partners";
import { isString, ArchonEmbed } from "../../";

interface Partner {
    tc?: boolean,
    title: string,
    description: string,
    reddit?: string | string[],
    discord: string,
    image: string,
    color: string,
    footer: string,
}

export default class PartnerCommand extends Command {
    public constructor() {
        super("partner", {
            aliases: ["partner", "affiliate"],
            category: "Public",
            description: {
                content: "Show affiliated discord servers",
                usage: "partner <name>",
                examples: [
                    "partner raiden"
                ]
            },
            args: [
                {
                    id: "name",
                    type: "string"
                }
            ],
            ratelimit: 3
        });
    }

    private getRedditName(url: string): string {
        const urlArr = url.split("/");
        const title = urlArr[urlArr.indexOf("r") + 1];
        return title;
    }

    private omgetaStyle(partner: Partner): MessageEmbed {
        const title = partner.tc ? `TC | ${partner.title.replace(" ", "")}` : partner.title;
        let desc = partner.description;
        if (partner.reddit) {
            if (isString(partner.reddit)) partner.reddit = partner.reddit.split(null);
            const redditLinks = partner.reddit.map(e => `**[r/${this.getRedditName(e)}](${e})**`).join(" | ");
            desc += `\n\n${redditLinks}`;
        }

        return new ArchonEmbed()
            .setTitle(`**${title}**`)
            .setURL(partner.discord)
            .setDescription(desc)
            .setImage(partner.image)
            .setColor(partner.color)
            .setFooter(partner.footer ? partner.footer + " | " + partner.discord : partner.discord);
    }

    // TODO: add fail message if not in partners
    public async exec(message: Message, { name }: { name: string }): Promise<Message> {
        try {
            if (name in partners) {
                const partner = partners[name];
                const embed = this.omgetaStyle(partner);
                return message.channel.send(embed);
            } else {
                return message.channel.send(new ArchonEmbed()
                    .setDescription(`${message.author}, no such partner exists.`)
                );
            }
        } catch (err) {
            this.client.log.error(err);
        }
    }
}