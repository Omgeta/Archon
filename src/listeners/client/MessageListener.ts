import { Message } from "discord.js";
import { Listener } from "discord-akairo";
import { boost as boostResponses } from "../../assets/json/phrases.json";
import { sprintf } from "../../";


export default class MessageListener extends Listener {
    public constructor() {
        super("guildMemberUpdate", {
            emitter: "client",
            event: "message",
            category: "client"
        });
    }

    public exec(message: Message): void {
        if (message.type.includes("USER_PREMIUM_GUILD_SUBSCRIPTION")) {
            const formatString = boostResponses[Math.floor(Math.random() * boostResponses.length)];
            const final = sprintf(formatString, message.author.toString());
            message.channel.send(final);
        }
    }
}