import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";

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
        const playerBot = serverData.playBot;

        if (!playerBot.paused) return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${serverData.nextQueue[0].title} Sedang diputar.`)], ephemeral: true });
        playerBot.resume();
        await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${serverData.nextQueue[0].title} Berhasil di resume.`)] });
        setTimeout(() => {
            interaction.deleteReply();
        }, 60000);
    },
};

export default resume;
