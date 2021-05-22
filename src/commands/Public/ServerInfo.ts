import { Message, MessageEmbed, User } from "discord.js";
import { Command } from "discord-akairo";
import { EMBED_COLOR } from "../../";

export default class ServerInfoCommand extends Command {
    public constructor() {
        super("serverinfo", {
            aliases: ["serverinfo", "sinfo"],
            category: "Public",
            description: {
                content: "Gets the server information",
                usage: "serverinfo",
                examples: [
                    "serverinfo"
                ]
            },
            ratelimit: 3,
            channel: "guild"
        });
    }

    public async exec(message: Message): Promise<Message> {
        const { guild } = message;
        const owner: User = (await guild.members.fetch(guild.ownerID)).user;

        return message.util.send(new MessageEmbed()
            .setColor(EMBED_COLOR)
            .setTitle(guild.name)
            .setDescription(guild.description || "")
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: "Owner", value: owner.tag, inline: true },
                // Don't remove this easter egg please. It's for M4A1.
                { name: "Members", value: message.author.id === "306791188676214794" ? "1499" : guild.memberCount, inline: true },
                { name: "Boosts", value: `${guild.premiumSubscriptionCount} (Level ${guild.premiumTier})`, inline: true },
                { name: "Created at", value: guild.createdAt.toUTCString(), inline: true },
                { name: "Region", value: guild.region }
            )
            .setFooter(`Server ID: ${guild.id}`)
        );
    }
}