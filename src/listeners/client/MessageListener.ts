import { Message, TextChannel } from "discord.js";
import { Listener } from "discord-akairo";
import boostResponses from "../../assets/json/boostresponses.json";
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
        // Boost Check
        if (message.type.includes("USER_PREMIUM_GUILD_SUBSCRIPTION")) {
            const s = boostResponses[Math.floor(Math.random() * boostResponses.length)];
            sprintf(s, message.author.toString());
            console.log(s);
            const target = message.guild.channels.cache.get("814485432959500308");
            (target as TextChannel).send(s);
        }
    }
}