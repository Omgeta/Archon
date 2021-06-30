import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            category: "client",
            type: "once"
        });
    }

    public async exec(): Promise<void> {
        this.client.log.info(`${this.client.user.tag} is online`);

        this.client.user.setActivity("new leaks", {
            type: "WATCHING"
        });
    }
}