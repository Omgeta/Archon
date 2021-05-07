import { Message } from "discord.js";
import { Listener } from "discord-akairo";

export default class LeaksListener extends Listener {
    public constructor() {
        super("leaks", {
            emitter: "client",
            event: "message",
            category: "client",
            type: "on"
        });
    }


    public async exec(message: Message): Promise<Message> {
        if (message.channel.id === "806208252488319026" && message.content.search("@Leaks") !== -1 && message.webhookID) {
            return message.channel.send("<@&811571844787339314>");
        }
    }
}