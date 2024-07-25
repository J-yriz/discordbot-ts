import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Message,
} from "discord.js";
import { MusicDiscord, dataServer } from "../../utils/musicDiscord";
import { MoonlinkTrack } from "moonlink.js";
import { find } from "llyrics";
import config from "../../config";

const useGenius: boolean = config.LyricsEngine.UseGenius;
const lyrics = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Menampilkan lirik music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        await interaction.deferReply();

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const queue: MoonlinkTrack[] = serverData.nextQueue;

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

class Data {
    song: string;
    artist: string;
    geniusApiKey: string;
    engine: string;
    forceSearch?: boolean;

    constructor(song: string, artist: string, geniusApiKey: string, engine: string) {
        this.song = song;
        this.artist = artist;
        this.geniusApiKey = geniusApiKey;
        this.engine = engine;
        this.forceSearch = config.LyricsEngine.ForceSearch;
    }
}

const phrasesToRemove: string[] = [
    "Full Video",
    "Full Audio",
    "Official Music Video",
    "Lyrics",
    "Lyrical Video",
    "Feat.",
    "Ft.",
    "Official",
    "Audio",
    "Video",
    "HD",
    "4K",
    "Remix",
    "Lyric Video",
    "Lyrics Video",
    "8K",
    "High Quality",
    "Animation Video",
    "\\(Official Video\\. .*\\)",
    "\\(Music Video\\. .*\\)",
    "\\[NCS Release\\]",
    "Extended",
    "DJ Edit",
    "with Lyrics",
    "Lyrics",
    "Karaoke",
    "Instrumental",
    "Live",
    "Acoustic",
    "Cover",
    "\\(feat\\. .*\\)",
];

let dataObject: Data;
let trySearch: number = 3;

export let row: ActionRowBuilder<ButtonBuilder>;

export let queueMusic: MoonlinkTrack;
export let lyric: string;
export let sisaLyrics: string;
export let lyricsEmbed: Message<boolean>;
export function setLyricsEmbedUndi() {
    if (lyricsEmbed) {
        lyricsEmbed.delete();
        (lyricsEmbed as any) = undefined;
    }
}

const getLyrics = async (interaction: ChatInputCommandInteraction, queue: MoonlinkTrack) => {
    queueMusic = queue;
    const songTitle = queue.title
        .replace(new RegExp(phrasesToRemove.join("|"), "gi"), "")
        .replace(/\s*([\[\(].*?[\]\)])?\s*(\|.*)?\s*(\*.*)?$/, "")
        .trim()
        .split("-");

    if (config.LyricsEngine.GeniusToken && useGenius) {
        dataObject = new Data(songTitle[1].trim(), songTitle[0].trim(), config.LyricsEngine.GeniusToken, "genius");
    } else {
        dataObject = new Data(songTitle[1].trim(), songTitle[0].trim(), "DONTFORGET", "youtube");
    }

    const notFoundEmbed = new EmbedBuilder()
        .setTitle(queue.title)
        .setURL(queue.url)
        .setThumbnail(queue.artworkUrl)
        .setDescription('Lirik tidak ditemukan\n\nBisa terjadi karna lirik tidak tersedia atau music yang diputar adalah music "Live"')
        .setColor("Random")
        .setTimestamp();

    const search = await find(dataObject);
    if (search.lyrics === undefined) {
        return await interaction.editReply({
            embeds: [notFoundEmbed],
        });
    }

    const lyrics: string[] = search.lyrics.split("\n");
    let prevNextCondition: boolean = true;
    lyric = formatLyrics(lyrics.join("\n"));
    if (lyrics.join("\n").length > 2000) {
        prevNextCondition = false;
        lyric = lyric.slice(0, 2000);
        sisaLyrics = lyric.slice(2000);
    }

    const buttonPrevLyrics = new ButtonBuilder()
        .setCustomId("prevLyrics")
        .setLabel("⬅️ Prev Lyrics")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(prevNextCondition);
    const buttonNextLyrics = new ButtonBuilder()
        .setCustomId("nextLyrics")
        .setLabel("Next Lyrics ➡️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(prevNextCondition);
    const buttonDeleteLyrics = new ButtonBuilder()
        .setCustomId("deleteLyrics")
        .setLabel("🗑️ Delete Lyrics")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(false);

    row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonPrevLyrics, buttonNextLyrics, buttonDeleteLyrics);

    if (trySearch > 0) {
        if (search.artist !== songTitle[0].trim()) {
            getLyrics(interaction, queue);
            trySearch--;
        } else {
            trySearch = 3;
            setLyricsEmbedUndi();
            return lyricsEmbed = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(queue.title)
                        .setURL(queue.url)
                        .setThumbnail(queue.artworkUrl)
                        .setDescription(lyric)
                        .setColor("Random")
                        .setTimestamp(),
                ],
                components: [row],
            });
        }
    } else {
        trySearch = 3;
        return await interaction.editReply({
            embeds: [notFoundEmbed],
        });
    }
};

function formatLyrics(lyrics: string) {
    const sections = ["[Pre-Chorus]", "[Chorus]", "[Verse 2]", "[Bridge]", "[Outro]"];
    let formattedLyrics = "";
    const lines = lyrics.split("\n");

    lines.forEach((line) => {
        if (sections.some((section) => line.includes(section))) {
            formattedLyrics += "\n";
        }
        formattedLyrics += line + "\n";
    });

    return formattedLyrics;
}

export default lyrics;
