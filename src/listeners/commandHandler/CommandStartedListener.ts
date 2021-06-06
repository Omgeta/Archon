import { Message } from "discord.js";
import { Listener, Command } from "discord-akairo";

export default class CommandStartedListener extends Listener {
    public constructor() {
        super("commandStarted", {
            emitter: "commandHandler",
            event: "commandStarted",
            category: "commandHandler",
            type: "on"
        });
    }


    public exec(message: Message, command: Command, args: any): void {
        this.client.log.info(`${message.author.tag} (${message.author.id}) started command ${command.id} (${Object.values(args).join(" ")})`);
    }
}