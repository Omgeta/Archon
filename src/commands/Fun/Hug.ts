import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../../";
import { hug } from "../../assets/json/gifs.json";

export default class HugCommand extends Command {
    public constructor() {
        super("hug", {
            aliases: ["hug"],
            category: "Fun",
            description: {
                content: "Hug another user.",
                usage: "hug <user>",
                examples: [
                    "hug @Omgeta"
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
        const gifLink = hug[Math.floor(Math.random() * hug.length)];

        return message.channel.send(new ArchonEmbed()
            .setDescription(`${message.author} hugged ${target}`)
            .setImage(gifLink)
        );
    }
}