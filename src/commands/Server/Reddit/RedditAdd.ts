import { Message, TextChannel } from "discord.js";
import { Command, Argument } from "discord-akairo";
import { redditAxios as axios } from "../../../";

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
                    id: "subredditName",
                    type: "string",
                    prompt: {
                        start: message => `Which subreddit would you like to add ${message.author}?`,
                        retry: message => `I can't find that subreddit! Try again ${message.author}`
                    }
                },
                {
                    id: "targetChannel",
                    type: Argument.union("newsChannel", "textChannel"),
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

    private async getSubreddit(subredditName: string): Promise<Record<string, unknown>> {
        try {
            const response = await axios.get(`/r/${subredditName}/about.json`);
            return response.data.data;
        } catch (err) {
            this.client.log.error(err);
        }
    }

    public async exec(message: Message, { subredditName, targetChannel }: { subredditName: string, targetChannel: TextChannel }): Promise<Message> {
        const guildReddits = this.client.settings.get(message.guild.id, "reddit", []);
        const subreddit = await this.getSubreddit(subredditName);

        const targetIndex = guildReddits.findIndex(chn => chn.id === targetChannel.id);
        if (targetIndex === -1) {
            const newChannel = {
                id: targetChannel.id,
                subreddits: [subreddit.id]
            };
            guildReddits.push(newChannel);
        } else if (!guildReddits[targetIndex].subreddits.includes(subreddit.id)) {
            guildReddits[targetIndex].subreddits.push(subreddit.id);
        }

        this.client.settings.set(message.guild.id, "reddit", guildReddits);

        return message.channel.send(`${subreddit.display_name_prefixed} added to ${targetChannel}`);
    }

}
