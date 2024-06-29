import { playSong } from "./play";
import App from "../../utils/discordBot";
import { queue, player, skipMusic, connection } from "../../utils/musicDiscord";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";

const noVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Kamu harus berada di voice channel untuk menggunakan perintah ini")
    .setColor("DarkRed");

const skip = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;
        const connect = connection(`${userVoice}`, interaction);
        const playerBot = player();

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
        playSong(queue, playerBot, interaction, app, userVoice, connect);
    },
};

export default skip;
