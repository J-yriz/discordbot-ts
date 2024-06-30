import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import { queue, noVoiceChannel } from "../../utils/musicDiscord";
import { Client, Song } from "genius-lyrics";
import { IQueue } from "../../utils/interface";
import config from "../../config";
const client: Client = new Client(config.GeniusToken);

const lyrics = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Menampilkan lirik music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;

        if (!userVoice)
            return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Searching for the lyrics...")],
        });

        if (queue.length === 0) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("Tidak ada music yang sedang diputar")],
            });
        }

        if (queue.length >= 1) {
            return getLyrics(interaction, queue[0]);
        }
    },
};

const getLyrics = async (interaction: ChatInputCommandInteraction, queue: IQueue) => {
    const search: Song[] = await client.songs.search(queue.title);
    const lyrics: string = await search[0].lyrics();
    const lyricsArray: string[] = lyrics.split("\n");
    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setTitle(queue.title)
                .setDescription(lyricsArray.join("\n"))
                .setColor("Random")
                .setFooter({ text: "Lirik diambil dari Genius API" })
                .setTimestamp(),
        ],
    });
};

export default lyrics;
