import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} from "discord.js";
import { playerBot } from "../../utils/musicDiscord";
import { AudioPlayer } from "@discordjs/voice";

const resume = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume music yang sedang dipause")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {

        playerBot.unpause();
        await interaction.reply({ content: "Resume music", ephemeral: true });
    },
};

export default resume;
