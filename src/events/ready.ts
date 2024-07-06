import App from "../utils/discordBot";
import { Events, ActivityType, PresenceUpdateStatus } from "discord.js";

const ready = (app: App, token: string, commands: any[]): void => {
    app.once(Events.ClientReady, (app) => {
        app.user.setActivity("Dakwah", { type: ActivityType.Listening });
        app.user.setStatus(PresenceUpdateStatus.Idle);
        console.log(`Logged in as ${app.user.tag}`);
    });
};

export default ready;
