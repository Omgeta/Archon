import { NewsChannel, TextChannel, Message } from "discord.js";
import { Command, Argument } from "discord-akairo";

export default class SayCommand extends Command {
    public constructor() {
        super("say", {
            aliases: ["say", "echo"],
            category: "Messages",
            description: {
                content: "Get the bot to say something",
                usage: "say <message>",
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
                    }
                },
                {
                    id: "targetChannel",
                    type: Argument.union("newsChannel", "textChannel"),
                    match: "option",
                    flag: ["--channel", "-c", "--target", "-t"],
                    prompt: {
                        start: message => `Which channel would you like me to send messages to ${message.author}?`,
                        retry: message => `I can't see that channel! Try again, ${message.author}`,
                        optional: true
                    },
                    default: message => message.channel
                },
                {
                    id: "del",
                    match: "flag",
                    flag: ["--delete", "-d"]
                }
            ],
            userPermissions: ["MANAGE_MESSAGES"],
            ratelimit: 3
        });
    }

    public async exec(message: Message, { text, targetChannel, del }: { text: string, targetChannel: NewsChannel | TextChannel, del: boolean }): Promise<Message> {
        if (del) {
            try {
                message.delete();
            } catch (e) {
                console.log("Could not delete message");
            }
        }
        try {
            return await targetChannel.send(text);
        } catch (e) {
            return message.channel.send("Sorry, I couldn't send a message there");
        }
    }
}