import { Guild, Message } from "discord.js";
import { Listener } from "discord-akairo";
import { resolveGuildMessage } from "../../";

export default class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            category: "client",
            type: "once"
        });
    }

    private async cleanReactions(guild: Guild, settings) {
        const initialLength = settings.reactrole.length;
        if (!initialLength) delete settings.reactrole;

        for (let i = 0; i < initialLength; i++) {
            const message = settings.reactrole[i];
            const reactionMessage: Message = await resolveGuildMessage(guild, message.id);
            if (!reactionMessage) {
                console.log(`Removing message ${message.id} from the database`);
                settings.reactrole.remove(i);
                continue;
            }

            // TODO: check and delete nonexistent emojis and roles
            // const { reactions } = message;
        }

        await this.client.settings.set(guild.id, "reactrole", settings.reactrole);
    }

    private async cleanDatabase(): Promise<void> {
        for (const [guildId, settings] of this.client.settings.items) {
            const guild: Guild = await this.client.guilds.cache.get(guildId);

            if (!guild) {
                console.log(`Removing guild ${guildId} from the database`);
                await this.client.settings.clear(guildId);
            }

            if (settings.reactrole) await this.cleanReactions(guild, settings);
        }
    }

    public async exec(): Promise<void> {
        console.log(`${this.client.user.tag} is online`);

        this.client.user.setActivity("with Yae", {
            type: "PLAYING"
        });

        await this.cleanDatabase();
    }
}