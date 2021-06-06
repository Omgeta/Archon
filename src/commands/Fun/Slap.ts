import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../../";
import { slap } from "../../assets/json/gifs.json";

export default class SlapCommand extends Command {
    public constructor() {
        super("slap", {
            aliases: ["slap"],
            category: "Fun",
            description: {
                content: "Slap another user.",
                usage: "slap <user>",
                examples: [
                    "slap @Omgeta"
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
        const gifLink = slap[Math.floor(Math.random() * slap.length)];

        return message.channel.send(new ArchonEmbed()
            .setDescription(`**${message.member.displayName}** slaped **${target.displayName}**...`)
            .setImage(gifLink)
        );
    }
}