import App from "../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { dataServer, MusicDiscord } from "../../utils/musicDiscord";
import { changeLoop } from "../../commands/music/loop";

const nodeClose = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("nodeClose", async (node) => {
        for (const key of dataServer.keys()) {
            const serverData: MusicDiscord = dataServer.get(key) as MusicDiscord;
            const interaction = serverData.interaction;
            const playerBot = serverData.playBot;
            if (playerBot.connected) {
                playerBot.disconnect();
                playerBot.destroy();
            }
            changeLoop(false);
            await interaction.channel?.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Terjadi Kesalahan pada System Music!")
                        .setFooter({ text: "Hubungi pembuat dari bot ini malmul_." })
                        .setColor("DarkRed")
                        .setTimestamp(),
                ],
            });
            dataServer.delete(key);
        }
        console.log(`${node.identifier} telah ditutup!`);
    });
};

export default nodeClose;
