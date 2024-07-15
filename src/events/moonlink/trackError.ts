import App from "../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { checkVoice, dataServer, MusicDiscord } from "../../utils/musicDiscord";
import { deleteResponse, interactionEx, playSong } from "../../commands/music/play";

const trackError = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("trackError", async () => {
        const serverData: MusicDiscord = dataServer.get(interactionEx.guildId as string) as MusicDiscord;
        const queue = serverData.nextQueue[0];
        deleteResponse();
        await interactionEx.channel?.send({
            embeds: [new EmbedBuilder().setTitle("Music Error").setDescription(`Skip music ${queue.title}`).setColor("DarkRed")],
        });
        serverData.nextQueue.shift();
        if (serverData.nextQueue.length > 0) {
            playSong(interactionEx, app, checkVoice(interactionEx), serverData);
        }
    });
};

export default trackError;
