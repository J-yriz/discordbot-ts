import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";
import { MusicDiscord, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
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
        const guild: GuildMember = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember;
        const userVoice: string = guild?.voice.channel?.id as string;
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const queue = serverData.queue;

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Searching for the lyrics...")],
        });

        if (queue.length === 0) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("Tidak ada music yang sedang diputar")],
            });
        }

        if (queue.length >= 1) {
            return await getLyrics(interaction, queue[0]);
        }
    },
};

const getLyrics = async (interaction: ChatInputCommandInteraction, queue: IQueue) => {
    const search: Song[] = await client.songs.search(queue.title);
    if (search.length === 0) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(queue.title)
                    .setURL(queue.uri)
                    .setDescription(
                        'Lirik tidak ditemukan\n\nTerjadi kesalahan saat mencari lirik bisa karna music mengandung unicode atau music "Live"'
                    )
                    .setColor("Random")
                    .setFooter({ text: "Lirik diambil dari Genius API" })
                    .setTimestamp(),
            ],
        });
    }
    const lyrics: string = await search[0].lyrics();
    const lyricsArray: string[] = lyrics.split("\n");
    const hasSections =
        lyricsArray.includes("[Intro]") || lyricsArray.includes("[Chorus]") || lyricsArray.includes("[Verse]") || lyricsArray.includes("[Outro]");

    if (!hasSections) {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(queue.title)
                    .setURL(queue.uri)
                    .setDescription('Lirik tidak ditemukan\n\nBisa terjadi karna lirik tidak tersedia atau music yang diputar adalah music "Live"')
                    .setColor("Random")
                    .setFooter({ text: "Lirik diambil dari Genius API" })
                    .setTimestamp(),
            ],
        });
    } else {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(queue.title)
                    .setURL(queue.uri)
                    .setDescription(lyricsArray.join("\n"))
                    .setColor("Random")
                    .setFooter({ text: "Lirik diambil dari Genius API" })
                    .setTimestamp(),
            ],
        });
    }
};

export default lyrics;
