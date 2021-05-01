import { MessageReaction, User } from "discord.js";
import MessageReactionListener from "../../structures/listeners/MessageReactionListener";

export default class MessageReactionRemoveListener extends MessageReactionListener {
    public constructor() {
        super("messageReactionRemove", {
            emitter: "client",
            event: "messageReactionRemove",
            category: "client"
        });
    }

    public async exec(reaction: MessageReaction, user: User): Promise<void> {
        await this.fetchPartialReaction(reaction);
        this.handleReaction(reaction, user, false);
    }
}