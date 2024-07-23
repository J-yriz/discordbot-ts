import App from "../../utils/discordBot";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
    StringSelectMenuInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Message,
} from "discord.js";
import { MoonlinkPlayer, MoonlinkTrack, SearchResult } from "moonlink.js";
import { looping } from "./loop";
import config from "../../config";

let firstPlay: number;
const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Mainkan music yang kamu inginkan.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addStringOption((option) => option.setName("song").setDescription("Masukan judul musik atau link.").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const query: string = interaction.options.getString("song") as string;
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        if (query.includes("https://") && !query.includes("youtube.com")) {
            if (!query.includes("youtu.be")) {
                return await interaction.reply({ content: "Tolong berikan link dari youtube.", ephemeral: true });
            }
        }

        await interaction.deferReply();

        let res: SearchResult;
        const node = app.lavaClient?.nodes.get(config.Lavalink.nodeName);
        if (node.state === "READY") {
            res = (await app.lavaClient?.search({
                query,
                source: "youtube",
                requester: interaction.user.id,
            })) as SearchResult;
        } else {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder().setTitle("Lavalink tidak terhubung!").setDescription("Silahkan tunggu beberapa waktu.").setColor("Random"),
                ],
            });
        }

        if (!res.tracks.length) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("No tracks found").setColor("Random")],
            });
        }

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const tracks: MoonlinkTrack = res.tracks[0];

        serverData.nextQueue.push(tracks);

        if (serverData.nextQueue.length === 1) {
            await interaction.editReply({ content: "Memutar music..." });
            firstPlay = 0;
            playSong(interaction, app, userVoice, serverData);
        } else {
            await interaction.editReply({
                content: "",
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Music ditambahkan ke antrian." })
                        .setTitle(tracks.title)
                        .setURL(tracks.url)
                        .setColor("Green")
                        .setTimestamp(),
                ],
            });
        }
    },
};

export function durationMusic(durasi: number): string {
    const hasilBagi = durasi / 60000;
    let jam = Math.floor(hasilBagi);
    let menit = Math.round((hasilBagi - jam) * 60)
        .toString()
        .padStart(2, "0");
    return `${jam}:${menit}`;
}

export const deleteResponse = (serverData: MusicDiscord): void => {
    const firstResponse = serverData.firstResponse;
    const nextResponse = serverData.nextResponse;
    if (nextResponse) {
        nextResponse.delete();
        serverData.nextResponse = undefined;
    } else if (firstResponse) {
        firstResponse.delete();
        serverData.firstResponse = undefined;
    }
};

export let skipPrevCondition: boolean = false;
export const setSkipPrevCondition = (condition: boolean): void => {
    skipPrevCondition = condition;
};

export const playSong = async (
    interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
    app: App,
    userVoice: string,
    serverData: MusicDiscord
): Promise<void> => {
    serverData.interaction = interaction;
    if (Object.keys(serverData.playBot).length === 0) {
        serverData.playBot = serverData.playerBot(interaction, app, userVoice);
    }
    const playerBot: MoonlinkPlayer = serverData.playBot;

    if (!playerBot.connected) {
        playerBot.connect({ setDeaf: true, setMute: false });
    }

    const queue: MoonlinkTrack[] = serverData.nextQueue;
    const nextTrack: MoonlinkTrack = queue[0];
    playerBot.play(nextTrack);

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild?.name} • Now playing` })
        .setTitle(`${nextTrack.title}`)
        .setURL(nextTrack.url)
        .setThumbnail(nextTrack.artworkUrl)
        .addFields(
            { name: "Author Music", value: `${nextTrack.author}`, inline: true },
            {
                name: "Durasi Music",
                value: `${durationMusic(nextTrack.duration)}`,
                inline: true,
            },
            {
                name: "Looping Status",
                value: `${looping ? "Aktif" : "Tidak Aktif"}`,
                inline: true,
            }
        )
        .setColor("Red")
        .setTimestamp();

    const nextButton: ButtonBuilder = new ButtonBuilder().setCustomId("next").setLabel(" Next").setStyle(ButtonStyle.Secondary).setEmoji("⏭️");
    const prevButton: ButtonBuilder = new ButtonBuilder().setCustomId("prev").setLabel(" Prev").setStyle(ButtonStyle.Secondary).setEmoji("⏮️");
    const pauseButton: ButtonBuilder = new ButtonBuilder().setCustomId("pause").setLabel(" Pause").setStyle(ButtonStyle.Secondary).setEmoji("⏸️");
    const resumeButton: ButtonBuilder = new ButtonBuilder().setCustomId("resume").setLabel(" Resume").setStyle(ButtonStyle.Secondary).setEmoji("▶️");
    const lyricsButton: ButtonBuilder = new ButtonBuilder().setCustomId("lyrics").setLabel(" Lyrics").setStyle(ButtonStyle.Secondary).setEmoji("📜");
    const loopButton: ButtonBuilder = new ButtonBuilder().setCustomId("loop").setLabel(" Loop").setStyle(ButtonStyle.Secondary).setEmoji("🔁");
    const queueButton: ButtonBuilder = new ButtonBuilder().setCustomId("queue").setLabel(" Queue").setStyle(ButtonStyle.Secondary).setEmoji("📋");
    const shuffleButton: ButtonBuilder = new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel(" Shuffle")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔀");
    const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
        prevButton,
        pauseButton,
        resumeButton,
        nextButton
    );
    const row1: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
        lyricsButton,
        loopButton,
        queueButton,
        shuffleButton
    );

    if (firstPlay === 0) {
        serverData.firstResponse = await interaction.editReply({ content: "", embeds: [embed], components: [row, row1] });
        firstPlay++;
    } else {
        serverData.nextResponse = await interaction.channel?.send({ content: "", embeds: [embed], components: [row, row1] });
    }
};

export default play;
