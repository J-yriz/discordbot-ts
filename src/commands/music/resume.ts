import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { AudioPlayer } from "@discordjs/voice";

const resume = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume music yang sedang dipause")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const playerBot: AudioPlayer = serverData.playerBot();

        playerBot.unpause();
        await interaction.reply({ content: "Resume music", ephemeral: true });
    },
};

export default resume;
