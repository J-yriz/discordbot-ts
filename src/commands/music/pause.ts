import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { AudioPlayer } from "@discordjs/voice";

const pause = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pause music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const playerBot: AudioPlayer = serverData.playerBot();

        if (serverData.queue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music yang sedang diputar`,
                ephemeral: true,
            });

        playerBot.pause();
        await interaction.reply({ content: "Pause music", ephemeral: true });
    },
};

export default pause;
