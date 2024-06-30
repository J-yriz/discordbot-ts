import { playSong } from "./play";
import App from "../../utils/discordBot";
import { queue, playerBot, connection, skipMusic, noVoiceChannel } from "../../utils/musicDiscord";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import { AudioPlayer, VoiceConnection } from "@discordjs/voice";

const skip = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;
        const connect: VoiceConnection = connection(`${userVoice}`, interaction);

        if (!userVoice)
            return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        if (queue.length === 0)
            return await interaction.reply({ content: `Tidak ada music yang sedang diputar`, ephemeral: true });

        if (queue.length === 1)
            return await interaction.reply({ content: `Tidak ada antrian music`, ephemeral: true });

        await interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle("Success").setDescription(`Skip music ${queue[0].title}`).setColor("Green"),
            ],
        });
        skipMusic(interaction);
        playSong(queue, playerBot, interaction, app, userVoice, connect);
    },
};

export default skip;
