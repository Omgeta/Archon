import { Message, GuildEmoji, ReactionEmoji, Role } from "discord.js";
import { Command } from "discord-akairo";

export default class ReactRoleCommand extends Command {
    public constructor() {
        super("reactrole", {
            aliases: ["reactrole", "rr"],
            category: "Admin",
            description: {
                content: "Bind reactions to roles",
                usage: "reactrole <messageId> <emoji> <role>",
                examples: [
                    "reactrole 123 :thinking: @Thinker"
                ]
            },
            args: [
                {
                    id: "target",
                    type: "guildMessage"
                },
                {
                    id: "emoji",
                    type: "emoji"
                },
                {
                    id: "role",
                    type: "role"
                }
            ],
            ratelimit: 5
        });
    }

    public exec(message: Message, { target, emoji, role }: { target: Message, emoji: GuildEmoji | ReactionEmoji, role: Role }): Promise<Message> {
        const reactions = this.client.reactRole.get(message.guild.id, target.id, {});

        reactions[emoji.name] = role.id;
        this.client.reactRole.set(message.guild.id, target.id, reactions);

        target.react(emoji);

        return message.channel.send(`Bound ${emoji} to ${role.name}`);
    }
}