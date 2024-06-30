import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} from "discord.js";
import { playerBot, queue } from "../../utils/musicDiscord";
import { AudioPlayer } from "@discordjs/voice";

const pause = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("pause music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {

        if (queue.length === 0)
            return await interaction.reply({ content: `Tidak ada music yang sedang diputar`, ephemeral: true });

        playerBot.pause();
        await interaction.reply({ content: "Pause music", ephemeral: true });
    },
};

export default pause;
