import { join } from "path";
import { AkairoClient, CommandHandler, ListenerHandler, MongooseProvider } from "discord-akairo";
import { Message } from "discord.js";
import { Logger as WinstonLogger } from "winston";
import { guildModel } from "../database";
import { logger } from "../utils/Logger";

const prefix: string = process.env.PREFIX;
const owners: string[] = (process.env.OWNERS || "").split(",");

declare module "discord-akairo" {
    interface AkairoClient {
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
        settings: MongooseProvider;
        log: WinstonLogger;
    }
}

interface BotOptions {
    token?: string;
    owners?: string | string[];
}

export default class ArchonClient extends AkairoClient {
    public config: BotOptions;
    public settings: MongooseProvider;
    public log: WinstonLogger = logger;
    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, "..", "listeners")
    });
    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, "..", "commands"),
        prefix: message => {
            if (message.guild) {
                return this.settings.get(message.guild.id, "prefix", prefix);
            }

            return "";
        },
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 6e4,
        argumentDefaults: {
            prompt: {
                modifyStart: (_: Message, str: string) => `${str}\n\ntype \`cancel\` to cancel the command`,
                modifyRetry: (_: Message, str: string) => `${str}\n\ntype \`cancel\` to cancel the command`,
                timeout: "Command timed out.",
                ended: "You exceeded the maximum number of tries.",
                cancel: "This command has been cancelled.",
                retries: 3,
                time: 3e5
            },
            otherwise: ""
        },
        ignorePermissions: owners,
        ignoreCooldown: owners,
        blockBots: true
    });

    public constructor(config: BotOptions) {
        super({
            ownerID: config.owners,
            partials: ["MESSAGE", "CHANNEL", "REACTION"]
        });

        this.config = config;
        this.settings = new MongooseProvider(guildModel);
    }

    private async _init(): Promise<void> {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process
        });
        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    public async start(): Promise<string> {
        await this._init();
        await this.settings.init();
        return this.login(this.config.token);
    }
}

