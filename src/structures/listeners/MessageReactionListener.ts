import { MessageReaction, User } from "discord.js";
import { Listener, ListenerOptions } from "discord-akairo";

export default abstract class MessageReactionListener extends Listener {
    constructor(name: string, data: ListenerOptions) {
        super(name, data);
        if (this.constructor === MessageReactionListener) throw new Error("Cannot instantiate abstract class");
    }

    protected async fetchPartialReaction(reaction: MessageReaction): Promise<void> {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (err) {
                this.client.log.error(`Error when fetching the message: ${err}`);
                return;
            }
        }
    }

    protected async handleReaction(reaction: MessageReaction, user: User, adding: boolean): Promise<void> {
        const message = reaction.message;
        const { guild } = message;

        const guildReactions = this.client.settings.get(guild.id, "reactrole", null);
        if (!guildReactions) return;

        const fetchedMessage = guildReactions.find(msg => msg.id === message.id);
        if (!fetchedMessage) return;

        for (const emojiName in fetchedMessage.reactions) {
            if (reaction.emoji.name === emojiName) {
                const roleId = fetchedMessage.reactions[emojiName];
                const role = await guild.roles.cache.get(roleId);

                if (role) {
                    const member = await guild.members.cache.get(user.id);

                    if (adding) {
                        member.roles.add(role);
                    } else {
                        member.roles.remove(role);
                    }
                }

                return;
            }
        }
    }
}