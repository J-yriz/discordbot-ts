import App from "../../utils/discordBot";
import { connection, noVoiceChannel } from "../../utils/musicDiscord";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";

const join = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join the voice channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;

        if (!userVoice)
            return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });
        connection(userVoice, interaction);

        await interaction.reply({ content: `Join to <#${userVoice}>`, ephemeral: true });
    },
};

export default join;
