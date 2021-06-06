import { Message } from "discord.js";
import { Listener, Command } from "discord-akairo";

export default class CommandFinishedListener extends Listener {
    public constructor() {
        super("commandFinished", {
            emitter: "commandHandler",
            event: "commandFinished",
            category: "commandHandler",
            type: "on"
        });
    }


    public exec(message: Message, command: Command, args: any, returnValue: any): void {
        this.client.log.info(`${message.author.tag} (${message.author.id}) ended command ${command.id} (${Object.values(args).join(" ")})`);
    }
}