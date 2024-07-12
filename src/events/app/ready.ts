import App from "../../utils/discordBot";
import { Events, ActivityType, PresenceUpdateStatus } from "discord.js";

const ready = (app: App, token: string, commands: any[]): void => {
    app.on("raw", d => app.lavaClient?.packetUpdate(d));
    app.once(Events.ClientReady, async (appBot) => {
        appBot.user.setActivity("Dakwah", { type: ActivityType.Listening });
        appBot.user.setStatus(PresenceUpdateStatus.Idle);
        console.log(`Logged in as ${appBot.user.tag}`);
        app.lavaClient?.init(appBot.user.id);
    });
};

export default ready;
