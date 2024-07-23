import App from "../../utils/discordBot";
import { MusicDiscord, dataServer, checkVoice } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const disconnect = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Mengeluarkan bot dari voice channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;

        if (Object.keys(serverData.playBot).length === 0) return await interaction.reply({ content: `Bot tidak sedang terhubung ke voice channel`, ephemeral: true });
        
        await interaction.reply({ content: `Disconnected from <#${userVoice}>`, ephemeral: true });
        if (serverData.nextQueue.length > 0) {
            serverData.nextQueue.length = 1;
            serverData.playBot.stop();
        } else {
            serverData.nextQueue.length = 0;
            serverData.playBot.disconnect();
            serverData.playBot.destroy();
            dataServer.delete(interaction.guildId as string);
        }
    },
};

export default disconnect;
