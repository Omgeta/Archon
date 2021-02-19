import { TextChannel, Message } from "discord.js";
import { Command } from "discord-akairo";

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

    public async exec(message: Message, { text, targetChannel }: { text: string, targetChannel: TextChannel }): Promise<Message> {
        try {
            return await targetChannel.send(text);
        } catch (e) {
            return message.channel.send("Sorry, I couldn't send a message there");
        }
    }
}