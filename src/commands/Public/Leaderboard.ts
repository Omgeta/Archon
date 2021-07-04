import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { pityCalculator, EMBED_COLOR, PYRO_COLOR, ArchonEmbed, LeaderboardManager } from "../../";

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
    public exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
        const leaderboardManager = new LeaderboardManager(this.client);
        const userData = leaderboardManager.findUser(member.user);

        if (userData) {
            const [rank, row] = userData;
            const total = LeaderboardManager.calculateTotal(row);
            const chances = pityCalculator.calculateStr(Math.floor(total / 14400));

            let color: string;
            switch (rank) {
                case 1: color = "#FFD700"; break;
                case 2: color = "#C0C0C0"; break;
                case 3: color = "#CD7F32"; break;
                default: color = EMBED_COLOR;
            }

            return message.channel.send(new ArchonEmbed()
                .setTitle(`**${member.displayName}**`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: "Ranking", value: rank },
                    { name: "Primogems", value: total },
                    { name: "Constellation Chances", value: chances }
                )
                .setColor(color)
            );
        } else {
            return message.util.send(new ArchonEmbed()
                .setDescription(
                    `
                    ${member.displayName} doesn't have an entry in the leaderboard!
                    To learn how to submit an entry, please read the pinned rules.
                    If you want to learn more, please feel free to ask questions to staff members.
                    `
                )
                .setColor(PYRO_COLOR)
            );
        }
    }
}