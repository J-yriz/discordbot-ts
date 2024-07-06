import { VoiceConnection } from "@discordjs/voice";
import App from "../../utils/discordBot";
import { changeLoop } from "./loop";
import { MusicDiscord, dataServer, checkVoice, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const disconnect = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Mengeluarkan bot dari voice channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const connect: VoiceConnection = serverData.connection(userVoice, interaction);
        await interaction.reply({ content: `Disconnected from <#${userVoice}>`, ephemeral: true });
        connect.destroy();
        changeLoop(false);
        dataServer.delete(interaction.guildId as string);
    },
};

export default disconnect;
