import { Message, TextChannel } from "discord.js";
import { Command } from "discord-akairo";

export default class RedditAddCommand extends Command {
    public constructor() {
        super("redditadd", {
            category: "Server",
            description: {
                content: "Add subreddits in your server",
                usage: "reddit add <subreddit> <channel>",
                examples: [
                    "reddit add r/RaidenMains #reddit-feed"
                ]
            },
            args: [
                {
                    id: "subreddit",
                    type: "string",
                    prompt: {
                        start: message => `Which subreddit would you like to add ${message.author}?`,
                        retry: message => `I can't find that subreddit! Try again ${message.author}`
                    }
                },
                {
                    id: "targetChannel",
                    type: "textChannel",
                    prompt: {
                        start: message => `Which channel would you like to link to the subreddit ${message.author}?`,
                        retry: message => `I can't find that channel! Try again ${message.author}`,
                        optional: true
                    },
                    default: message => message.channel
                }
            ],
            clientPermissions: ["MANAGE_WEBHOOKS"],
            userPermissions: ["MANAGE_GUILD"],
            ratelimit: 3
        });
    }

    public async exec(message: Message, { subreddit, targetChannel }: { subreddit: string, targetChannel: TextChannel }): Promise<Message> {
        return message.util.send("Reddit add executed");
        // TODO: check db for subreddits in channel
        // TODO: if sub already in channel then exit
        // TODO: else add sub to database and create webhook for channel and save webhook id to database
    }

}
