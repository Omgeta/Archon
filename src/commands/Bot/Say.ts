import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message } from "discord.js";

export default class SayCommand extends Command {
    public constructor() {
        super("say", {
            aliases: ["say", "echo"],
            category: "Bot",
            description: {
                content: "Get the bot to say something",
                usage: "say < message >",
                examples: [
                    "say hello"
                ]
            },
            args: [
                {
                    id: "text",
                    type: "string",
                    match: "rest",
                    prompt: {
                        start: message => `What would you like me to say ${message.author}?`,
                        retry: message => `I can't say that! Try again, ${message.author}`
                    },
                    unordered: true
                },
                {
                    id: "targetChannel",
                    type: "textChannel",
                    match: "option",
                    flag: ["--channel", "-c", "--target", "-t"],
                    default: message => message.channel
                }
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            ratelimit: 3
        });
    }

    public exec(message: Message, { text, targetChannel }: { text: string, targetChannel: TextChannel }): Promise<Message> {
        return targetChannel.send(text);
    }
}