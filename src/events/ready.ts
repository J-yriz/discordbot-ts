import App from "../utils/discordBot";
import { Events } from "discord.js";

const ready = (app: App, token: string, commands: any[]): void => {
    app.once(Events.ClientReady, (app) => {
        console.log(`Logged in as ${app.user.tag}`);
    });
};

export default ready;
