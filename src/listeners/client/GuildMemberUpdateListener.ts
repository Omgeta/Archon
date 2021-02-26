import { GuildMember } from "discord.js";
import { Listener } from "discord-akairo";

export default class GuildMemberUpdateListener extends Listener {
    public constructor() {
        super("guildMemberUpdate", {
            emitter: "client",
            event: "guildMemberUpdate",
            category: "client"
        });
    }

    public exec(oldMember: GuildMember, newMember: GuildMember): void {
        if (!oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp) {
            console.log(`${newMember} has boosted the server`);
            // return newMember.guild.systemChannel.send(`Thank you!`)
        }
    }
}