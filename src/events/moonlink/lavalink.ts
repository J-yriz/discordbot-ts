import App from "../../utils/discordBot";
import config from "../../config";
import { MoonlinkManager } from "moonlink.js";

const lavalink = (app: App, token: string, commands: any[]) => {
    app.lavaClient = new MoonlinkManager(
        [
            {
                host: `${config.Lavalink.LavaIP}`,
                port: config.Lavalink.LavaPort,
                secure: config.Lavalink.Secure,
                password: `${config.Lavalink.LavaPass}`,
                identifier: `${config.Lavalink.nodeName}`,
            },
        ],
        {},
        (guildId: string, sPayload: any) => {
            const guild = app.guilds.cache.get(guildId);
            if (guild) {
                guild.shard.send(JSON.parse(sPayload));
            }
        }
    );
};

export default lavalink;
