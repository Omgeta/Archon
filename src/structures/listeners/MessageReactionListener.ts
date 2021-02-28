import { MessageReaction, User } from "discord.js";
import { Listener, ListenerOptions } from "discord-akairo";

export default abstract class MessageReactionListener extends Listener {
    constructor(name: string, data: ListenerOptions) {
        super(name, data);
        if (this.constructor === MessageReactionListener) throw new Error("Cannot instantiate abstract class");
    }

    protected async handleReaction(reaction: MessageReaction, user: User, adding: boolean): Promise<void> {
        const message = reaction.message;
        const { guild } = message;

        const fetchedMessage = this.client.reactRole.get(guild.id, message.id, null);
        if (!fetchedMessage) return;

        for (const key of Object.keys(fetchedMessage)) {
            if (reaction.emoji.name === key) {
                const roleId = fetchedMessage[key];
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