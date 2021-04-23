import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import * as partners from "../../assets/json/partners";

interface Partner {
    tc: boolean,
    title: string,
    description: string,
    reddit?: string,
    discord: string,
    image: string,
    color: string,
    footer: string,
}

export default class PartnerCommand extends Command {
    public constructor() {
        super("partner", {
            aliases: ["partner", "affiliate"],
            category: "Debug",
            description: {
                content: "Show template embeds for Venti",
                usage: "et",
                examples: [
                    "et"
                ]
            },
            args: [
                {
                    id: "name",
                    type: "string"
                }
            ],
            ratelimit: 3
            // ownerOnly: true
        });
    }

    private omgetaStyle(partner: Partner): MessageEmbed {
        const title = partner.tc ? `TC | ${partner.title.replace(" ", "")}` : partner.title;
        let desc = partner.description;
        if (partner.reddit) {
            const s = partner.reddit.split("/");
            const subredditName = s[s.findIndex(e => e === "r") + 1];

            desc += `\n\n**[r/${subredditName}](${partner.reddit})**`;
        }

        return new MessageEmbed()
            .setTitle(`**${title}**`)
            .setURL(partner.discord)
            .setDescription(desc)
            .setImage(partner.image)
            .setColor(partner.color)
            .setFooter(partner.footer ? partner.footer : "");
    }

    public async exec(message: Message, { name }: { name: string }): Promise<void> {
        try {
            const partner = partners[name];
            await message.channel.send(this.omgetaStyle(partner));
        } catch (err) {
            console.error(err);
        }
    }
}