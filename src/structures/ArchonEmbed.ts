import { MessageEmbed } from "discord.js";
import { EMBED_COLOR } from "../";

export class ArchonEmbed extends MessageEmbed {
    constructor(data = {}) {
        super(data);
        if (!this.color) this.setColor(EMBED_COLOR);
    }
}