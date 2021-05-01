import { Message, GuildEmoji, ReactionEmoji, Role } from "discord.js";
import { Command } from "discord-akairo";

export default class ReactRoleCommand extends Command {
    public constructor() {
        super("reactrole", {
            aliases: ["reactrole", "rr"],
            category: "Server",
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
                    type: "guildMessage",
                    prompt: {
                        start: message => `Which message would you like to add reactions to ${message.author}?`,
                        retry: message => `That's not a valid message! Try again ${message.author}`
                    }
                },
                {
                    id: "emoji",
                    type: "emoji",
                    prompt: {
                        start: message => `Which emoji would you like to bind ${message.author}?`,
                        retry: message => `That's not a valid emoji! Try again ${message.author}`
                    }
                },
                {
                    id: "role",
                    type: "role",
                    prompt: {
                        start: message => `Which role would you like to bind ${message.author}?`,
                        retry: message => `That's not a valid role! Try again ${message.author}`
                    }
                }
            ],
            ratelimit: 5,
            userPermissions: ["MANAGE_GUILD"],
            clientPermissions: ["MANAGE_ROLES"],
            channel: "guild"
        });
    }

    public exec(message: Message, { target, emoji, role }: { target: Message, emoji: GuildEmoji | ReactionEmoji, role: Role }): Promise<Message> {
        const guildReactions = this.client.settings.get(message.guild.id, "reactrole", []);

        const targetIndex = guildReactions.findIndex(msg => msg.id === target.id);
        if (targetIndex === -1) {
            const newMessage = {
                id: target.id,
                reactions: {
                    [emoji.name]: role.id
                }
            };
            guildReactions.push(newMessage);
        } else {
            guildReactions[targetIndex][emoji.name] = role.id;
        }

        this.client.settings.set(message.guild.id, "reactrole", guildReactions);

        target.react(emoji);

        return message.channel.send(`Bound ${emoji} to ${role.name}`);
    }
}