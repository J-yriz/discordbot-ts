import App from "../../utils/discordBot";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { AudioPlayer, AudioPlayerStatus, AudioResource, VoiceConnection } from "@discordjs/voice";
import { IQueue, ITrackGet } from "../../utils/interface";
import { looping, changeLoop } from "./loop";
import trackGet from "../../api/lavalink/trackGet";
import { playTrack } from "../../api/lavalink/ytdl";
import { responseChat } from "./search";

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

        const dataServerGet = dataServer.get(interaction.guildId as string);
        dataServerGet?.queue.push(track);
        const serverData: MusicDiscord = dataServerGet as MusicDiscord;

        if (serverData.queue.length === 1) {
            const connect: VoiceConnection = serverData.connection(userVoice, interaction);
            await interaction.editReply({ content: "Memutar music..." });
            playSong(interaction, app, userVoice, connect);
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

let firstPlay: number = 0;
export const playSong = async (
    interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
    app: App,
    userVoice: string,
    connect: VoiceConnection
): Promise<void> => {
    const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
    const queue: IQueue[] = serverData.queue;
    const nextTrack: IQueue = queue[0];
    const resourceMusic: AudioResource = serverData.resource(playTrack(nextTrack.uri));
    const playerBot: AudioPlayer = serverData.playerBot();
    playerBot.stop();
    playerBot.play(resourceMusic);
    connect.subscribe(playerBot);

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Now playing" })
        .setTitle(nextTrack.title)
        .setURL(nextTrack.uri)
        .addFields(
            { name: "Author Music", value: `${nextTrack.author}`, inline: true },
            {
                name: "Durasi Music",
                value: `${durationMusic(nextTrack.length)}`,
                inline: true,
            }
        )
        .setColor("Red")
        .setTimestamp();

    if (firstPlay === 0) {
        // from search
        if (responseChat) {
            responseChat.edit({ content: "", embeds: [embed], components: [] });
        } else {
            // from play
            await interaction.editReply({ content: "", embeds: [embed] });
        }
        firstPlay++;
    } else {
        await interaction.channel?.send({ embeds: [embed] });
    }

    // Don't remove this if u see this error
    playerBot.removeAllListeners("error");
    playerBot.on("error", async () => {
        await interaction.channel?.send({
            embeds: [new EmbedBuilder().setTitle("Music Error").setDescription(`Skip music ${queue[0].title}`).setColor("DarkRed")],
        });
        serverData.queue.shift();
        if (queue.length > 0) {
            playSong(interaction, app, userVoice, connect);
        }
    });

    // Don't remove this if u see this error
    playerBot.removeAllListeners(AudioPlayerStatus.Idle);
    playerBot.on(AudioPlayerStatus.Idle, async () => {
        if (!looping) serverData.queue.shift();
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
