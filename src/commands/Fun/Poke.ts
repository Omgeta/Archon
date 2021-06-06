import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../../";
import { poke } from "../../assets/json/gifs.json";

export default class PokeCommand extends Command {
    public constructor() {
        super("poke", {
            aliases: ["poke"],
            category: "Fun",
            description: {
                content: "Poke another user.",
                usage: "poke <user>",
                examples: [
                    "poke @Omgeta"
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
        const gifLink = poke[Math.floor(Math.random() * poke.length)];

        return message.channel.send(new ArchonEmbed()
            .setDescription(`**${message.member.displayName}** poked **${target.displayName}**...`)
            .setImage(gifLink)
        );
    }
}