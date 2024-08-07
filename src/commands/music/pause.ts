import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";

const pause = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pause music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const playerBot = serverData.playBot;

        if (serverData.nextQueue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music yang sedang diputar`,
                ephemeral: true,
            });

        if (playerBot.paused) return await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${serverData.nextQueue[0].title} Sudah terpause.`)], ephemeral: true });
        playerBot.pause();
        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle(`${serverData.nextQueue[0].title} Berhasil di pause.`)],
        });
        setTimeout(() => {
            interaction.deleteReply();
        }, 60000);
    },
};

export default pause;
