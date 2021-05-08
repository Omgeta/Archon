import { Message } from "discord.js";
import { Command } from "discord-akairo";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import { ArchonEmbed } from "../../";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export default class TimeCommand extends Command {
    public constructor() {
        super("time", {
            aliases: ["time", "now", "clock"],
            category: "Public",
            description: {
                content: "Check the current Genshin Impact server time",
                usage: "time",
                examples: [
                    "time"
                ]
            },
            ratelimit: 5
        });
    }

    private timeToReset(currentTime: dayjs.Dayjs) {
        const resetTime = currentTime.add(1, "day").hour(4).minute(0).second(0);
        return dayjs.duration(resetTime.diff(currentTime));
    }

    private formatTime(currentTime: dayjs.Dayjs) {
        return `${currentTime.format("h:mm A")} (*${this.timeToReset(currentTime).format("H[h] m[m]")} until reset*)`;
    }

    public exec(message: Message): Promise<Message> {
        const now = dayjs();
        const NA = now.tz("America/New_York");
        const EU = now.tz("Europe/Paris");
        const AS = now.tz("Asia/Shanghai");

        return message.util.send(new ArchonEmbed()
            .setTitle("Genshin Server Clock")
            .setDescription(
                `
                **America:**
                ${this.formatTime(NA)}
                **Europe:**
                ${this.formatTime(EU)}
                **Asia/SAR:**
                ${this.formatTime(AS)}
                `
            )
        );
    }
}