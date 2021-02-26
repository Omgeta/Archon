import { MessageReaction, User } from "discord.js";
import MessageReactionListener from "../../structures/listeners/MessageReactionListener";

export default class MessageReactionAddListener extends MessageReactionListener {
    public constructor() {
        super("messageReactionAdd", {
            emitter: "client",
            event: "messageReactionAdd",
            category: "client"
        });
    }

    public async exec(reaction: MessageReaction, user: User): Promise<void> {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (err) {
                console.error(`Error when fetching the message: ${err}`);
                return;
            }
        }

        this.handleReaction(reaction, user, true);
    }
}