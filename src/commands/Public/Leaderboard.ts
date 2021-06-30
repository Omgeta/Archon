import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { pityCalculator, PYRO_COLOR, ArchonEmbed, LeaderboardManager } from "../../";

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
        const leaderboardManager = new LeaderboardManager(this.client);
        const [rank, row] = leaderboardManager.findUser(member.user);
        if (row) {
            const total = LeaderboardManager.calculateTotal(row);
            const chances = pityCalculator.calculateStr(Math.floor(total / 14400));

            return message.channel.send(new ArchonEmbed()
                .setTitle(`**${member.displayName}**`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: "Ranking", value: rank },
                    { name: "Primogems", value: total },
                    { name: "Constellation Chances", value: chances }
                )
            );
        } else {
            return message.util.send(new ArchonEmbed()
                .setDescription(
                    `${member.displayName} doesn't have an entry in the leaderboard!
                    Please submit your details when the next announcement is made for Raiden Check.
                    `
                )
                .setColor(PYRO_COLOR)
            );
        }
    }
}