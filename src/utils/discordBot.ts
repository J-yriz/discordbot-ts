import fs from "fs";
import path from "path";
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
    commandsCollection: Collection<string, Command> = new Collection<string, Command>();
    buttonsCollection: Collection<string, Button> = new Collection<string, Button>();
    stringSelectCollection: Collection<string, StringSelect> = new Collection<string, StringSelect>();
    commands: {} = [];

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
        for (const eventFile of eventFolders) {
            if (eventFile.replace(".js", "") === "regisSlashCommand") continue;
            const event = await import(`../events/${eventFile}`);
            event.default(this, token, this.commands);
        }
        this.login(token);
    }
}
