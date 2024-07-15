import App from "../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { MoonlinkPlayer } from "moonlink.js";
import { looping, changeLoop } from "../../commands/music/loop";
import { checkVoice, dataServer, MusicDiscord } from "../../utils/musicDiscord";
import { deleteResponse, setSkipPrevCondition, skipPrevCondition, interactionEx, playSong } from "../../commands/music/play";

const trackEnd = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("trackEnd", async () => {
        const serverData: MusicDiscord = dataServer.get(interactionEx.guildId as string) as MusicDiscord;
        const playerBot = serverData.playBot;
        const queue = serverData.nextQueue;
        console.log("Track selesai", serverData.nextQueue[0].title);
        deleteResponse();
        if (!skipPrevCondition) {
            if (!looping) {
                serverData.prevQueue.push(queue[0]);
                serverData.nextQueue.shift();
            }
        } else if (skipPrevCondition) {
            setSkipPrevCondition(false);
        }
    
        if (queue.length > 0) {
            playSong(interactionEx, app, checkVoice(interactionEx), serverData);
        } else {
            if (playerBot) {
                playerBot.disconnect();
                playerBot.destroy();
                serverData.playBot = {} as MoonlinkPlayer;
            }
            changeLoop(false);
            dataServer.delete(interactionEx.guildId as string);
            await interactionEx.channel?.send({
                embeds: [new EmbedBuilder().setTitle("Music selesai, bot dikeluarkan.").setColor("LightGrey")],
            });
        }
    });
};

export default trackEnd;