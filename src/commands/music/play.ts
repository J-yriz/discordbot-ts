import App from "../../utils/discordBot";
import {
    queue,
    connection,
    playerBot,
    resource,
    setQueue,
    skipMusic,
    noVoiceChannel,
} from "../../utils/musicDiscord";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import { AudioPlayer, AudioPlayerStatus, AudioResource, VoiceConnection } from "@discordjs/voice";
import { IQueue } from "../../utils/interface";

const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play music with the bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName("song").setDescription("The song you want to play").setRequired(true)
        ),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const query = interaction.options.getString("song");
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;

        if (!userVoice)
            return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Searching for the song...")],
        });

        const trackGet = await app.lavaClient(query);

        if (trackGet === "No tracks found")
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("No tracks found")],
            });

        const track = {
            title: trackGet.title,
            uri: trackGet.uri,
            author: trackGet.author,
            length: trackGet.length,
        };

        setQueue(track, interaction);

        if (queue.length === 1) {
            const connect: VoiceConnection = connection(userVoice, interaction);
            const resourceMusic: AudioResource = resource(app.lavaPlay(track.uri));
            playerBot.play(resourceMusic);
            connect.subscribe(playerBot);

            playSong(queue, playerBot, interaction, app, userVoice, connect);
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

function durationMusic(durasi: number): string {
    const hasilBagi = durasi / 60000;
    let jam = Math.floor(hasilBagi);
    let menit = Math.round((hasilBagi - jam) * 60)
        .toString()
        .padStart(2, "0");
    return `${jam}:${menit}`;
}

export const playSong = async (
    queue: IQueue[],
    playerBot: AudioPlayer,
    interaction: ChatInputCommandInteraction,
    app: App,
    userVoice: string,
    connect: VoiceConnection
): Promise<void> => {
    const nextTrack = queue[0];
    const resourceMusic = resource(app.lavaPlay(nextTrack.uri));
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
            embeds: [
                new EmbedBuilder()
                    .setTitle("Music Error")
                    .setDescription(`Skip music ${queue[0].title}`),
            ],
        });
        skipMusic(interaction);
        if (queue.length > 0) {
            playSong(queue, playerBot, interaction, app, userVoice, connect);
        }
    });

    playerBot.removeAllListeners(AudioPlayerStatus.Idle);
    playerBot.on(AudioPlayerStatus.Idle, async () => {
        skipMusic(interaction);
        if (queue.length > 0) {
            playSong(queue, playerBot, interaction, app, userVoice, connect);
        } else {
            const connect = connection(userVoice, interaction);
            connect.destroy();
            await interaction.channel?.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Music selesai, bot dikeluarkan.")
                        .setColor("LightGrey"),
                ],
            });
        }
    });
};

export default play;
