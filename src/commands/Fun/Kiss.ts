import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../../";
import { kiss } from "../../assets/json/gifs.json";

export default class KissCommand extends Command {
    public constructor() {
        super("kiss", {
            aliases: ["kiss"],
            category: "Fun",
            description: {
                content: "Kiss another user.",
                usage: "kiss <user>",
                examples: [
                    "kiss @Omgeta"
                ]
            },
            args: [
                {
                    id: "target",
                    type: "member"
                }
            ],
            ratelimit: 3
        });
    }

    public async exec(message: Message, { target }: { target: GuildMember }): Promise<Message> {
        const gifLink = kiss[Math.floor(Math.random() * kiss.length)];

        return message.channel.send(new ArchonEmbed()
            .setDescription(`**${message.member.displayName}** kissed **${target.displayName}**`)
            .setImage(gifLink)
        );
    }
}