import { Message, MessageEmbed } from "discord.js";
import { Command } from "discord-akairo";
import templates from "../../assets/json/templates.json";

export default class EmbedTemplateCommand extends Command {
    public constructor() {
        super("embedtemplate", {
            aliases: ["embedtemplate", "et"],
            category: "Debug",
            description: {
                content: "Show template embeds",
                usage: "et",
                examples: [
                    "et"
                ]
            },
            ratelimit: 3,
            ownerOnly: true,
            typing: true
        });
    }

    private async sendTemplates(message: Message): Promise<void> {
        for (const template of templates) {
            await message.channel.send(template["_comment"]);
            await message.channel.send(new MessageEmbed(template));
        }
    }

    public async exec(message: Message): Promise<void> {
        try {
            await this.sendTemplates(message);
        } catch (err) {
            console.error(err);
        }
    }
}