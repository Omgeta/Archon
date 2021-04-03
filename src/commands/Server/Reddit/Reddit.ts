import { Message } from "discord.js";
import { Command, Flag } from "discord-akairo";

export default class RedditCommand extends Command {
    public constructor() {
        super("reddit", {
            aliases: ["reddit", "subreddit"],
            category: "Server",
            description: {
                content: "Follow and check subreddits in your server",
                usage: "reddit <add/remove/list>",
                examples: [
                    "reddit add r/RaidenMains #reddit-feed",
                    "reddit remove r/RaidenMains",
                    "reddit list"
                ]
            },
            ratelimit: 3
        });
    }

    private *args(message: Message) {
        const sub = yield {
            type: ["add", "remove", "list"],
            prompt: {
                start: `Would you like to add, remove or list all subreddits in your server? (add/remove/list) ${message.member}`
            }
        };

        return Flag.continue("reddit" + sub);
    }
}
