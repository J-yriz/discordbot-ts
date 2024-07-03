import App from "../../utils/discordBot";
import { MusicDiscord, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";
import { AudioPlayer, AudioPlayerStatus, AudioResource, VoiceConnection } from "@discordjs/voice";
import { IQueue } from "../../utils/interface";
import { looping, changeLoop } from "./loop";

const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music with the bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addStringOption((option) => option.setName("song").setDescription("Music apa saja yang ingin kamu putar.").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const query = interaction.options.getString("song");
        const guild: GuildMember = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember;
        const userVoice: string = guild?.voice.channel?.id as string;

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Searching for the song...")],
        });

        const trackGet = await app.lavaClient(query);
        if (!trackGet.length) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("No tracks found").setColor("Random")],
            });
        }
        const trackGetInfo = trackGet[0].info;

        const track: IQueue = {
            title: trackGetInfo.title,
            uri: trackGetInfo.uri,
            author: trackGetInfo.author,
            length: trackGetInfo.length,
        };

        dataServer.get(interaction.guildId as string)?.queue.push(track);
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        console.log(serverData.queue);

        if (serverData.queue.length === 1) {
            const connect: VoiceConnection = serverData.connection(userVoice, interaction);
            const resourceMusic: AudioResource = serverData.resource(app.lavaPlay(track.uri));
            const playerBot: AudioPlayer = serverData.playerBot();
            playerBot.play(resourceMusic);
            connect.subscribe(playerBot);

            playSong(serverData, playerBot, interaction, app, userVoice, connect);
        } else {
            await interaction.editReply({
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

export const playSong = async (
    serverData: MusicDiscord,
    playerBot: AudioPlayer,
    interaction: ChatInputCommandInteraction,
    app: App,
    userVoice: string,
    connect: VoiceConnection
): Promise<void> => {
    const queue: IQueue[] = serverData.queue;
    const nextTrack: IQueue = queue[0];
    const resourceMusic: AudioResource = serverData.resource(app.lavaPlay(nextTrack.uri));
    playerBot.stop();
    playerBot.play(resourceMusic);
    connect.subscribe(playerBot);

    await interaction.channel?.send({
        embeds: [
            new EmbedBuilder()
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
                .setTimestamp(),
        ],
    });

    playerBot.removeAllListeners("error");
    playerBot.on("error", async () => {
        await interaction.channel?.send({
            embeds: [new EmbedBuilder().setTitle("Music Error").setDescription(`Skip music ${queue[0].title}`)],
        });
        serverData.queue.shift();
        if (queue.length > 0) {
            playSong(serverData, playerBot, interaction, app, userVoice, connect);
        }
    });

    playerBot.removeAllListeners(AudioPlayerStatus.Idle);
    playerBot.on(AudioPlayerStatus.Idle, async () => {
        if (!looping) serverData.queue.shift();
        if (queue.length > 0) {
            playSong(serverData, playerBot, interaction, app, userVoice, connect);
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
