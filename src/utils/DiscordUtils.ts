import { Message, TextChannel, Guild } from "discord.js";

export async function resolveGuildMessage(guild: Guild, messageId: string): Promise<Message> {
    if (!messageId) return null;
    for (const channel of guild.channels.cache.values()) {
        if (channel.type !== "text") continue;
        try {
            return await (channel as TextChannel).messages.fetch(messageId);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    return null;
}