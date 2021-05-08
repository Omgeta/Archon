import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { ArchonEmbed } from "../../";

export default class InfoCommand extends Command {
    public constructor() {
        super("info", {
            aliases: ["info", "information", "support", "discord"],
            category: "Utility",
            description: {
                content: "Know more about me",
                usage: "info",
                examples: [
                    "info"
                ]
            },
            ratelimit: 3
        });
    }

    public exec(message: Message): Promise<Message> {
        return message.util.send(new ArchonEmbed()
            .setTitle(`__**${this.client.user.username}**__`)
            .setDescription(
                `
                Behold the Eternal Archon, Raiden.

                Archon aims to provide discord features that are perfect for setting up your Genshin Impact server.

                If you have any issues or questions, DM omgeta#8841.
                `
            )
            .setThumbnail(this.client.user.avatarURL())
        );
    }
}