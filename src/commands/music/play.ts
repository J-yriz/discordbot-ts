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
import { looping, changeLoop } from "./loop";

let firstPlay: number = 0;
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

        await interaction.deferReply();

        const res: SearchResult = (await app.lavaClient?.search({
            query,
            source: "youtube",
            requester: interaction.user.id,
        })) as SearchResult;
        if (!res.tracks.length) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("No tracks found").setColor("Random")],
            });
        }

        const tracks: MoonlinkTrack = res.tracks[0];

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        serverData.nextQueue.push(tracks);

        if (serverData.nextQueue.length === 1) {
            await interaction.editReply({ content: "Memutar music..." });
            firstPlay = 0;
            playSong(interaction, app, userVoice);
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

let firstResponse: Message<boolean> | undefined;
let nextResponse: Message<boolean> | undefined;
const setResponse = (): void => {
    firstResponse = undefined;
    nextResponse = undefined;
};
export const deleteResponse = (): void => {
    if (nextResponse) {
        nextResponse.delete();
        setResponse();
    } else if (firstResponse) {
        firstResponse.delete();
        setResponse();
    }
};

export let playerBot: MoonlinkPlayer;
export const setPlayerBot = (): void => {
    (playerBot as any) = undefined;
};

let skipPrevCondition: boolean = false;
export const setSkipPrevCondition = (condition: boolean): void => {
    skipPrevCondition = condition;
};

export const playSong = async (
    interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
    app: App,
    userVoice: string
): Promise<void> => {
    const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
    playerBot = serverData.playerBot(interaction, app, userVoice);

    if (!playerBot.connected) {
        playerBot.connect({ setDeaf: true, setMute: false });
    }

    const queue: MoonlinkTrack[] = serverData.nextQueue;
    const nextTrack: MoonlinkTrack = queue[0];
    playerBot.play(nextTrack);

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild?.name} • Now playing` })
        .setTitle(`${nextTrack.title}             `)
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
        firstResponse = await interaction.editReply({ content: "", embeds: [embed], components: [row, row1] });
        firstPlay++;
    } else {
        nextResponse = (await interaction.channel?.send({ content: "", embeds: [embed], components: [row, row1] })) as Message<boolean>;
    }

    (app as any).lavaClient?.removeAllListeners("trackError");
    app.lavaClient?.on("trackError", async () => {
        deleteResponse();
        await interaction.channel?.send({
            embeds: [new EmbedBuilder().setTitle("Music Error").setDescription(`Skip music ${queue[0].title}`).setColor("DarkRed")],
        });
        serverData.nextQueue.shift();
        if (queue.length > 0) {
            playSong(interaction, app, userVoice);
        }
    });

    (app as any).lavaClient?.removeAllListeners("trackEnd");
    app.lavaClient?.on("trackEnd", async () => {
        deleteResponse();
        if (!skipPrevCondition) {
            if (!looping) {
                serverData.prevQueue.push(queue[0]);
                serverData.nextQueue.shift();
            }
        } else if (skipPrevCondition) {
            setSkipPrevCondition(false);
        }
        if (queue.length > 0) {
            playSong(interaction, app, userVoice);
        } else {
            playerBot.disconnect();
            playerBot.destroy();
            changeLoop(false);
            dataServer.delete(interaction.guildId as string);
            await interaction.channel?.send({
                embeds: [new EmbedBuilder().setTitle("Music selesai, bot dikeluarkan.").setColor("LightGrey")],
            });
        }
    });

    app.lavaClient?.on("nodeClose", async (node) => {
        console.log(`${node.identifier} telah ditutup!`);
        playerBot.disconnect();
        playerBot.destroy();
        changeLoop(false);
        dataServer.delete(interaction.guildId as string);
        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Terjadi Kesalahan pada System Music!")
                    .setFooter({ text: "Hubungi pembuat dari bot ini malmul_." })
                    .setColor("DarkRed")
                    .setTimestamp(),
            ],
        });
    });
};

export default play;
