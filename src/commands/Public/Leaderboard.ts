import { Message, GuildMember, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import leaderboard from "../../assets/json/leaderboard.json";


export default class LeaderboardCommand extends Command {
    public constructor() {
        super("leaderboard", {
            aliases: ["leaderboard", "lb"],
            category: "Public",
            description: {
                content: "Check your current leaderboard stats",
                usage: "leaderboard <user>",
                examples: [
                    "leaderboard @Omgeta",
                    "leaderboard"
                ]
            },
            args: [
                {
                    id: "member",
                    type: "member",
                    default: message => message.member
                }
            ],
            ratelimit: 3
        });
    }

    private indexLeaderboard(username: string): Record<string, unknown> {
        for (const entry of leaderboard) {
            if (entry.Discord === username) return entry;
        }
    }

    public exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
        const entry = this.indexLeaderboard(member.user.tag);
        if (entry) {
            return message.channel.send(new MessageEmbed()
                .setTitle(member.displayName)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: "Ranking", value: entry.Ranking },
                    { name: "Primogems", value: entry.Total }
                )
            );
        } else {
            return message.channel.send(`Sorry ${member.displayName} doesn't have an entry here!`);
        }
    }
}