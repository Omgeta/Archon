import { Message } from "discord.js";
import { Command, Argument } from "discord-akairo";
import { PityCalculator, ArchonEmbed } from "../../";

export default class PityCalculateCommand extends Command {
    public constructor() {
        super("pitycalculate", {
            aliases: ["pitycalculate", "pcalc"],
            category: "Public",
            description: {
                content: "Estimates chances of getting constellations based on amount of pities rolled.",
                usage: "pcalc <number>",
                examples: [
                    "pcalc 4"
                ]
            },
            args: [
                {
                    id: "pity",
                    type: Argument.range("integer", 1, 13),
                    prompt: {
                        start: message => `How many pities do you wish to calculate for ${message.author}?`,
                        retry: message => `Number of pities has to between 1 and 13! Try again ${message.author}`
                    }
                }
            ],
            ratelimit: 3
        });
    }

    public async exec(message: Message, { pity }: { pity: number }): Promise<Message> {
        const pc = new PityCalculator();
        const counts = pc.calculate(pity);

        let desc = "";
        for (const [con, prob] of Object.entries(counts)) {
            desc += `**C${con}**: ${prob * 100}%\n`;
        }

        return message.util.send(new ArchonEmbed()
            .setTitle(`${pity} Pities`)
            .setDescription(desc)
            .setFooter("Calculation assumes every 5* is at 90 rolls")
        );
    }
}