import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { playerBot } from "./play";

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

        playerBot.unpause();
        if (playerBot.state.status !== "playing") return;
        await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${serverData.nextQueue[0].title} Berhasil di resume.`)] });
        setTimeout(() => {
            interaction.deleteReply();
        }, 60000);
    },
};

export default resume;
