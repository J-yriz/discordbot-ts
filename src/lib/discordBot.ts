import fs from "fs";
import path from "path";
import { Client, GatewayIntentBits } from "discord.js";


export default class App extends Client {

    commands: any = [];
    
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
        
        const eventPath = path.join(__dirname, '../events');
        const eventFolders = fs.readdirSync(eventPath);
        for (const eventFile of eventFolders) {
            if (eventFile.replace('.js', '') === 'regisSlashCommand') continue;
            const event = await import(`../events/${eventFile}`);
            event.default(this, token, this.commands);
        }

        this.login(token);
    }
}
