import { Message } from "discord.js";
import { Listener, Command } from "discord-akairo";
import { ArchonEmbed } from "../..";

export default class CommandBlockedListener extends Listener {
    public constructor() {
        super("commandBlocked", {
            emitter: "commandHandler",
            event: "commandBlocked",
            category: "commandHandler",
            type: "on"
        });
    }


    public async exec(message: Message, command: Command, reason: string): Promise<Message> {
        this.client.log.info(`${message.author.tag} (${message.author.id}) blocked from calling ${command.id} (${reason})`);
        return message.channel.send(new ArchonEmbed()
            .setDescription(`You can't use the commmand here (${reason}-only).`)
        );
    }
}