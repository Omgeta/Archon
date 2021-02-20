import { MessageEmbed } from "discord.js";
import { EMBED_COLOR } from "../";

export class ArchonEmbed extends MessageEmbed {
    constructor(data = {}) {
        super(data);
        this.setColor(EMBED_COLOR);
    }
}