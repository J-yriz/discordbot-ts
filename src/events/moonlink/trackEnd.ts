import App from "../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { looping, changeLoop } from "../../commands/music/loop";
import { dataServer, MusicDiscord } from "../../utils/musicDiscord";
import { deleteResponse, setSkipPrevCondition, skipPrevCondition, playSong } from "../../commands/music/play";
import { setLyricsEmbedUndi } from "../../commands/music/lyrics";

const trackEnd = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("trackEnd", async (player) => {
        const serverData: MusicDiscord = dataServer.get(player.guildId) as MusicDiscord;
        const interaction = serverData.interaction;
        const playerBot = serverData.playBot;
        const queue = serverData.nextQueue;
        deleteResponse(serverData);
        setLyricsEmbedUndi();
        if (!skipPrevCondition) {
            if (!looping) {
                serverData.prevQueue.push(queue[0]);
                serverData.nextQueue.shift();
            }
        } else if (skipPrevCondition) {
            setSkipPrevCondition(false);
        }

        if (queue.length > 0) {
            playSong(interaction, app, serverData);
        } else {
            if (playerBot) {
                playerBot.disconnect();
                playerBot.destroy();
            }
            changeLoop(false);
            await interaction.channel?.send({
                embeds: [new EmbedBuilder().setTitle("Music selesai, bot dikeluarkan.").setColor("LightGrey")],
            });
            dataServer.delete(player.guildId);
        }
    });
};

export default trackEnd;
