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
        const gifLink = hug[Math.floor(Math.random() * hug.length)];

        return message.channel.send(new ArchonEmbed()
            .setDescription(`**${message.member.displayName}** hugged **${target.displayName}**...`)
            .setImage(gifLink)
        );
    }
}