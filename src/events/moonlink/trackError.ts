import App from "../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { checkVoice, dataServer, MusicDiscord } from "../../utils/musicDiscord";
import { playSong } from "../../commands/music/play";

const trackError = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("trackError", async (player) => {
        const serverData: MusicDiscord = dataServer.get(player.guildId) as MusicDiscord;
        const interaction = serverData.interaction;
        const queue = serverData.nextQueue[0];
        await interaction.channel?.send({
            embeds: [new EmbedBuilder().setTitle("Music Error").setDescription(`Skip music ${queue.title}`).setColor("DarkRed")],
        });
        serverData.nextQueue.shift();
        // if (serverData.nextQueue.length > 0) {
        //     playSong(interaction, app, checkVoice(interaction), serverData);
        // }
    });
};

export default trackError;
