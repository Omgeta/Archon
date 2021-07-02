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
                    type: "member",
                    prompt: {
                        start: message => `Who would you like to perform that action on ${message.author}?`,
                        retry: message => `That isn't a valid user! Try again ${message.author}`
                    }
                }
            ],
            ratelimit: 3
        });
    }

    public async exec(message: Message, { target }: { target: GuildMember }): Promise<Message> {
        const gifLink = pat[Math.floor(Math.random() * pat.length)];

        return message.channel.send(new ArchonEmbed()
            .setDescription(`**${message.member.displayName}** is patting **${target.displayName}**...`)
            .setImage(gifLink)
        );
    }
}