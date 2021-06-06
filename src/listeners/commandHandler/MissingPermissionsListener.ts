import { Message } from "discord.js";
import { Listener, Command } from "discord-akairo";
import { ArchonEmbed } from "../../";

export default class MissingPermissionsListener extends Listener {
    public constructor() {
        super("missingPermissions", {
            emitter: "commandHandler",
            event: "missingPermissions",
            category: "commandHandler",
            type: "on"
        });
    }


    public async exec(message: Message, command: Command, type: string, missing: any): Promise<Message> {
        this.client.log.info(`${message.author.tag} (${message.author.id}) missing permissions to call ${command.id} (${Object.values(missing).join(", ")})`);
        return message.channel.send(new ArchonEmbed()
            .setDescription(`You are missing permission to use this command. (${Object.values(missing).join(", ")}).`)
        );
    }
}