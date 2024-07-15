import App from "../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { dataServer, MusicDiscord } from "../../utils/musicDiscord";
import { changeLoop } from "../../commands/music/loop";
import { interactionEx } from "../../commands/music/play";

const nodeClose = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("nodeClose", async (node) => {
        if (interactionEx) {
            const serverData: MusicDiscord = dataServer.get(interactionEx.guildId as string) as MusicDiscord;
            const playerBot = serverData.playBot;
            if (playerBot.connected) {
                playerBot.disconnect();
                playerBot.destroy();
            }
            changeLoop(false);
            dataServer.delete(interactionEx.guildId as string);
            await interactionEx.channel?.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Terjadi Kesalahan pada System Music!")
                        .setFooter({ text: "Hubungi pembuat dari bot ini malmul_." })
                        .setColor("DarkRed")
                        .setTimestamp(),
                ],
            });
        }
        console.log(`${node.identifier} telah ditutup!`);
    });
};

export default nodeClose;
