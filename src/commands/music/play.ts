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
import { AudioPlayer, AudioPlayerStatus, AudioResource, VoiceConnection } from "@discordjs/voice";
import { IQueue, ITrackGet } from "../../utils/interface";
import { looping, changeLoop } from "./loop";
import trackGet from "../../api/lavalink/trackGet";
import { playTrack } from "../../api/lavalink/ytdl";
import { responseChat } from "./search";

let firstPlay: number = 0;
const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Mainkan music yang kamu inginkan.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addStringOption((option) => option.setName("song").setDescription("Music apa saja yang ingin kamu putar.").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const query: string = interaction.options.getString("song") as string;
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        await interaction.deferReply();

        const trackGetData: ITrackGet[] = await trackGet(query);
        if (!trackGetData.length) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("No tracks found").setColor("Random")],
            });
        }
        const trackGetInfo = trackGetData[0].info;

        const track: IQueue = {
            title: trackGetInfo.title,
            uri: trackGetInfo.uri,
            author: trackGetInfo.author,
            length: trackGetInfo.length,
        };

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        serverData.nextQueue.push(track);

        if (serverData.nextQueue.length === 1) {
            const connect: VoiceConnection = serverData.connection(userVoice, interaction);
            await interaction.editReply({ content: "Memutar music..." });
            firstPlay = 0;
            playSong( interaction, app, userVoice, connect);
        } else {
            await interaction.editReply({
                content: "",
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Music ditambahkan ke antrian." })
                        .setTitle(track.title)
                        .setURL(track.uri)
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

export let firstResponse: Message<boolean>;
export let nextResponse: Message<boolean>;
export let playerBot: AudioPlayer;
export const playSong = async (
    interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
    app: App,
    userVoice: string,
    connect: VoiceConnection
): Promise<void> => {
    const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
    playerBot = serverData.playerBot();
    const queue: IQueue[] = serverData.nextQueue;
    const nextTrack: IQueue = queue[0];
    const resourceMusic: AudioResource = serverData.resource(playTrack(nextTrack.uri));
    playerBot.stop();
    playerBot.play(resourceMusic);
    connect.subscribe(playerBot);

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild?.name} • Now playing` })
        .setTitle(
            nextTrack.title
                .replace(/#\w+/g, "")
                .replace(/\s{2,}/g, " ")
                .trim()
        )
        .setURL(nextTrack.uri)
        .addFields(
            { name: "Author Music", value: `${nextTrack.author}`, inline: true },
            {
                name: "Durasi Music",
                value: `${durationMusic(nextTrack.length)}`,
                inline: true,
            }
        )
        .setThumbnail(interaction.guild?.iconURL() as string)
        .setColor("Red")
        .setTimestamp();

    const nextButton: ButtonBuilder = new ButtonBuilder().setCustomId("next").setStyle(ButtonStyle.Secondary).setEmoji("⏭️");
    const prevButton: ButtonBuilder = new ButtonBuilder().setCustomId("prev").setStyle(ButtonStyle.Secondary).setEmoji("⏮️");
    const pauseButton: ButtonBuilder = new ButtonBuilder().setCustomId("pause").setStyle(ButtonStyle.Secondary).setEmoji("⏸️");
    const resumeButton: ButtonBuilder = new ButtonBuilder().setCustomId("resume").setStyle(ButtonStyle.Secondary).setEmoji("▶️");
    const lyricsButton: ButtonBuilder = new ButtonBuilder().setCustomId("lyrics").setStyle(ButtonStyle.Secondary).setEmoji("📜");
    const loopButton: ButtonBuilder = new ButtonBuilder().setCustomId("loop").setStyle(ButtonStyle.Secondary).setEmoji("🔁");
    const queueButton: ButtonBuilder = new ButtonBuilder().setCustomId("queue").setStyle(ButtonStyle.Secondary).setEmoji("📋");
    const shuffleButton: ButtonBuilder = new ButtonBuilder().setCustomId("shuffle").setStyle(ButtonStyle.Secondary).setEmoji("🔀");
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
        nextResponse = await interaction.channel?.send({ content: "", embeds: [embed], components: [row, row1] }) as Message<boolean>;
    }

    // Don't remove this if u see this error
    (playerBot as any).removeAllListeners("error");
    playerBot.on("error", async () => {
        if (nextResponse) nextResponse.delete();
        else if (firstResponse) firstResponse.delete();
        await interaction.channel?.send({
            embeds: [new EmbedBuilder().setTitle("Music Error").setDescription(`Skip music ${queue[0].title}`).setColor("DarkRed")],
        });
        serverData.nextQueue.shift();
        if (queue.length > 0) {
            playSong(interaction, app, userVoice, connect);
        }
    });

    // Don't remove this if u see this error
    (playerBot as any).removeAllListeners(AudioPlayerStatus.Idle);
    playerBot.on(AudioPlayerStatus.Idle, async () => {
        if (!looping) serverData.nextQueue.shift();
        if (nextResponse) nextResponse.delete();
        else if (firstResponse) firstResponse.delete();
        if (queue.length > 0) {
            playSong(interaction, app, userVoice, connect);
        } else {
            const connect: VoiceConnection = serverData.connection(userVoice, interaction);
            connect.destroy();
            changeLoop(false);
            dataServer.delete(interaction.guildId as string);
            await interaction.channel?.send({
                embeds: [new EmbedBuilder().setTitle("Music selesai, bot dikeluarkan.").setColor("LightGrey")],
            });
        }
    });
};

export default play;
