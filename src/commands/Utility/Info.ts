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
            .setTitle(this.client.user.username)
            .setDescription(
                `
                Behold the Eternal Archon, Raiden.

                This bot provides general and Genshin-specific features which aim to improve the functionality of Genshin Impact discord servers and improve quality of life for all users.

                If you have any issues or questions, approach omgeta#8841 at the RaidenMains discord server.
                \u200b
                `
            )
            .setThumbnail(this.client.user.avatarURL())
            .setFooter("Powered by /r/RaidenMains")
        );
    }
}