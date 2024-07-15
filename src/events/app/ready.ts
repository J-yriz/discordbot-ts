import config from "../../config";
import App from "../../utils/discordBot";
import { Events, ActivityType, PresenceUpdateStatus, PresenceStatusData } from "discord.js";

const presenceConfig = config.Presence;
let activityType = presenceConfig.Activity.Type.toLocaleLowerCase();
const type = ActivityType[(activityType.charAt(0).toUpperCase() + activityType.slice(1)) as keyof typeof ActivityType];

let statusType = presenceConfig.Status.toLocaleLowerCase();
const status = PresenceUpdateStatus[(statusType.charAt(0).toUpperCase() + statusType.slice(1)) as keyof typeof PresenceUpdateStatus];

const ready = (app: App, token: string, commands: any[]): void => {
    app.on("raw", d => app.lavaClient?.packetUpdate(d));
    app.once(Events.ClientReady, async (appBot) => {
        appBot.user.setActivity(presenceConfig.Activity.Name, { type });
        appBot.user.setStatus(status as PresenceStatusData);
        console.log(`Logged in as ${appBot.user.tag}`);
        app.lavaClient?.init(appBot.user.id);
    });
};

export default ready;
