import fs from "fs";
import path from "path";
import WebSocket from "ws";
import config, { lavalink } from "../config";
import { Client, GatewayIntentBits } from "discord.js";
import trackGet from "../api/lavalink/trackGet";
import playTrack from "../api/lavalink/playTrack";

export default class App extends Client {
    commands: any = [];

    lavaClient: Function = trackGet;
    lavaPlay: Function = playTrack;

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
        const ws = new WebSocket(lavalink("ws"), {
            headers: {
                Authorization: config.Lavalink.LavaPass,
                "User-Id": config.ClientID,
                "Client-Name": "Lavalink-Jariz",
            },
        });
        ws.on("open", () => console.log("Connected to Lavalink WS"));
        ws.on("close", () => console.log("Disconnected from Lavalink WS"));

        this.login(token);
    }
}
