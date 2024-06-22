import fs from "fs";
import commandHandler from "../events/commandHandler";
import { Client, Events, GatewayIntentBits } from "discord.js";

export default class App extends Client {
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

    start(token: string = "") {
        if (!token) throw new Error("No token provided || Token is empty");

        const commands: any = [];

        fs.readdirSync("./src/events").forEach(async (file) => {
            const files = file.replace(".ts", "");
            const event = await import(`../events/${files}`);
            const eventName = event.default;
            if (typeof eventName !== "function" || files === 'regisSlashCommand') return;
            await eventName(this, token, commands);
        });
        console.log("Events loaded");

        this.login(token);
    }
}
