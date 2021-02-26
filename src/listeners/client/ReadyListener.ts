import { Guild, Message } from "discord.js";
import { Listener } from "discord-akairo";
import { isEmpty, resolveGuildMessage } from "../../";

export default class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            category: "client",
            type: "once"
        });
    }

    private async cleanseReactRole(): Promise<void> {
        for (const guildId of this.client.reactRole.items.keys()) {
            const guild: Guild = await this.client.guilds.cache.get(guildId);
            const messages = this.client.reactRole.items.get(guildId);

            if (!guild || isEmpty(messages)) {
                console.log(`Removing guild ${guildId} from the database`);
                await this.client.reactRole.clear(guildId);
                continue;
            }

            for (const messageId in messages) {
                const message: Message = await resolveGuildMessage(guild, messageId);
                if (!message) {
                    console.log(`Removing message ${messageId} from the database`);
                    await this.client.reactRole.delete(guildId, messageId);
                }
            }

        }
    }

    public async exec(): Promise<void> {
        console.log(`${this.client.user.tag} is online`);

        this.client.user.setActivity("the waifu wars", {
            type: "COMPETING"
        });

        await this.cleanseReactRole();
    }
}