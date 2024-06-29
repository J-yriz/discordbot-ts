import App from "../../utils/discordBot";
import {
    queue,
    connection,
    player,
    resource,
    setQueue,
    clearQueue,
    skipMusic,
} from "../../utils/musicDiscord";
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import { AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";
import { IQueue } from "../../utils/interface";

const noVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Kamu harus berada di voice channel untuk menggunakan perintah ini")
    .setColor("DarkRed");

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
            const connect = connection(userVoice, interaction);
            const playerBot = player();
            const resourceMusic = resource(app.lavaPlay(track.uri));
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

const secondToMinute = (second: number) => {
    const minute = Math.floor(second / 60000);
    const secondResult = second % 60;
    return `${minute}:${secondResult}`;
}

export const playSong = async (
    queue: IQueue[],
    playerBot: any,
    interaction: ChatInputCommandInteraction,
    app: App,
    userVoice: string,
    connect: VoiceConnection
) => {
    if (queue.length > 1) {
        skipMusic(interaction);
        playerBot.stop();
    }
    const nextTrack = queue[0];
    const resourceMusic = resource(app.lavaPlay(nextTrack.uri));
    playerBot.play(resourceMusic);
    connect.subscribe(playerBot);

    await interaction.channel?.send({
        embeds: [
            new EmbedBuilder()
                .setAuthor({ name: "Now playing" })
                .setTitle(nextTrack.title)
                .setURL(nextTrack.uri)
                .addFields(
                    { name: 'Author Music', value: `${nextTrack.author}`, inline: true },
                    { name: 'Durasi Music', value: `${secondToMinute(nextTrack.length)}`, inline: true },
                )
                .setColor("Red")
                .setTimestamp(),
        ],
    });

    playerBot.removeAllListeners("error");
    playerBot.on("error", async () => {
        await interaction.channel?.send({
            embeds: [
                new EmbedBuilder().setTitle("Music Error").setDescription(`Skip music ${queue[0].title}`),
            ],
        });
        if (queue.length > 0) {
            playSong(queue, playerBot, interaction, app, userVoice, connect);
        }
    });

    playerBot.removeAllListeners(AudioPlayerStatus.Idle);
    playerBot.on(AudioPlayerStatus.Idle, async () => {
        if (queue.length > 1) {
            playSong(queue, playerBot, interaction, app, userVoice, connect);
        } else {
            const connect = connection(userVoice, interaction);
            await interaction.channel?.send({
                embeds: [new EmbedBuilder().setTitle("Music selesai, bot dikeluarkan.").setColor("LightGrey")],
            });
            connect.destroy();
        }
    });
};

export default play;
