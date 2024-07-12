import fs from "fs";
import path from "path";
import { MoonlinkManager } from "moonlink.js";
import { Collection, Client, GatewayIntentBits, ChatInputCommandInteraction, ButtonInteraction, StringSelectMenuInteraction, ApplicationCommandType } from "discord.js";

export interface Command {
    data: {
        name: string;
        toJSON: () => any;
    };
    exec: (interaction: ChatInputCommandInteraction, app: App) => Promise<void>;
}

export interface Button {
    customId: string;
    exec: (interaction: ButtonInteraction, app: App) => Promise<void>;
}

export interface StringSelect {
    customId: string;
    exec: (interaction: StringSelectMenuInteraction, app: App) => Promise<void>;
}

export default class App extends Client {
    public commandsCollection: Collection<string, Command> = new Collection<string, Command>();
    public buttonsCollection: Collection<string, Button> = new Collection<string, Button>();
    public stringSelectCollection: Collection<string, StringSelect> = new Collection<string, StringSelect>();
    public commands: any[] = [];

    public lavaClient: MoonlinkManager | undefined;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
            ],
        });
    }

    async start(token: string = "") {
        if (!token) throw new Error("No token provided || Token is empty");

        const eventPath = path.join(__dirname, "../events");
        const eventFolders = fs.readdirSync(eventPath);
        for (const eventFolder of eventFolders) {
            const eventFiles = fs.readdirSync(`${eventPath}/${eventFolder}`);
            for (const eventFile of eventFiles) {
                if (eventFile.replace(".js", "") === "regisSlashCommand") continue;
                const event = await import(`${eventPath}/${eventFolder}/${eventFile}`);
                event.default(this, token, this.commands);
            }
        }
        this.login(token);
    }
}
