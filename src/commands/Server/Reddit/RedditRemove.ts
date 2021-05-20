import { Message, TextChannel } from "discord.js";
import { Command, Argument } from "discord-akairo";
import { redditAxios as axios } from "../../../";

export default class RedditAddCommand extends Command {
    public constructor() {
        super("redditremove", {
            category: "Server",
            description: {
                content: "Remove subreddits from your server",
                usage: "reddit remove <subreddit> <channel>",
                examples: [
                    "reddit remove r/RaidenMains #reddit-feed"
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
        if (targetIndex === -1 || !guildReddits[targetIndex].subreddits.includes(subreddit.id)) {
            return message.channel.send(`${subreddit.display_name_prefixed} does not exist in ${targetChannel}.`);
        } else if (guildReddits[targetIndex].subreddits.length > 1) {
            guildReddits[targetIndex].subreddits = guildReddits[targetIndex].subreddits.filter(s => s !== subreddit.id);
        } else {
            guildReddits.splice(targetIndex, targetIndex + 1);
        }

        this.client.settings.set(message.guild.id, "reddit", guildReddits);

        return message.channel.send(`${subreddit.display_name_prefixed} has been removed from ${targetChannel}`);
    }

}
