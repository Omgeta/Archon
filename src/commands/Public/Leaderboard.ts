import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { LeaderboardManager, PYRO_COLOR, ArchonEmbed } from "../../";

export default class LeaderboardCommand extends Command {
    public constructor() {
        super("leaderboard", {
            aliases: ["leaderboard"],
            category: "Public",
            description: {
                content: "Check your current leaderboard stats",
                usage: "leaderboard <user>",
                examples: [
                    "leaderboard @omgeta#8841",
                    "leaderboard omgeta",
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

    // TODO: add gold, silver, bronze for top 3
    // TODO: add feature to update leaderboard remotely
    // TODO: add feature to send full leaderboard
    public exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
        const leaderboardManager = new LeaderboardManager();

        const row = leaderboardManager.findUser(member.user.tag);
        if (row) {
            return message.channel.send(new ArchonEmbed()
                .setTitle(member.displayName)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: "Ranking", value: row.Ranking },
                    { name: "Primogems", value: row.Total }
                )
            );
        } else {
            return message.util.send(new ArchonEmbed()
                .setDescription(
                    `${member.displayName} doesn't have an entry in the leaderboard!
                    Please try again`
                )
                .setColor(PYRO_COLOR)
            );
        }
    }
}