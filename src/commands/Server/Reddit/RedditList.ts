import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { redditAxios as axios } from "../../../";

export default class RedditAddCommand extends Command {
    public constructor() {
        super("redditlist", {
            category: "Server",
            description: {
                content: "List all subreddits in your server",
                usage: "reddit list",
                examples: [
                    "reddit list"
                ]
            },
            ratelimit: 3
        });
    }

    private async findSubreddit(subredditId: string): Promise<Record<string, unknown>> {
        try {
            const response = await axios.get(`/api/info.json?id=t5_${subredditId}`);
            return response.data.data.children[0].data;
        } catch (err) {
            this.client.log.error(err);
        }
    }

    public async exec(message: Message): Promise<Message> {
        const guildReddits = this.client.settings.get(message.guild.id, "reddit", []);

        let desc = "";
        for (const chn of guildReddits) {
            const { id, subreddits } = chn;

            if (subreddits) {
                const channel = message.guild.channels.cache.get(id);
                desc += `__${channel.name}__\n`;

                for (const s of subreddits) {
                    desc += `${(await this.findSubreddit(s)).display_name_prefixed}\n`;
                }
            }

        }

        if (desc) {
            return message.channel.send(desc);
        } else {
            return message.channel.send("This server does not follow any subreddits");
        }
    }

}
