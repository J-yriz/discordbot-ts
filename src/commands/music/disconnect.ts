import { VoiceConnection } from "@discordjs/voice";
import App from "../../utils/discordBot";
import { queue, connection, clearQueue, noVoiceChannel } from "../../utils/musicDiscord";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";

const disconnect = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect the bot from the voice channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;

        if (!userVoice)
            return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });
        const connect: VoiceConnection = connection(userVoice, interaction);

        await interaction.reply({ content: `Disconnected from <#${userVoice}>`, ephemeral: true });
        connect.destroy();
        clearQueue(interaction);
    },
};

export default disconnect;
