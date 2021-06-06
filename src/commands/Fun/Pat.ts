import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../..";
import { pat } from "../../assets/json/gifs.json";

export default class PatCommand extends Command {
    public constructor() {
        super("pat", {
            aliases: ["pat"],
            category: "Fun",
            description: {
                content: "Pat another user.",
                usage: "pat <user>",
                examples: [
                    "pat @Omgeta"
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
        const gifLink = pat[Math.floor(Math.random() * pat.length)];

        return message.channel.send(new ArchonEmbed()
            .setDescription(`${message.author} is patting ${target}`)
            .setImage(gifLink)
        );
    }
}