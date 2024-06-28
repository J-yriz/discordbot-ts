import App from "../../utils/discordBot";
import Music from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from "@discordjs/voice";

const noVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("You need to be in a voice channel to play music")
    .setColor("#FF0000");

const errorEmbed: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Terjadi kesalahan saat memutar musik. Silahkan coba lagi nanti.")
    .setFooter({ text: "Hubungi pembuat dari bot ini malmul_." })
    .setColor("#FF0000");

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

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });
        const music: Music = new Music();
        
        await interaction.reply({ embeds: [new EmbedBuilder().setTitle("Searching for the song...")] });
        const trackGet = await app.lavaClient(query);
        const connection = music.connection(userVoice, interaction);
        const player = music.player();
        
        if (trackGet === "No tracks found")
            return await interaction.editReply({ embeds: [new EmbedBuilder().setTitle("No tracks found")] });
        const playTrack = app.lavaPlay(trackGet.uri);
        const resource = music.resource(playTrack);
        player.play(resource);
        connection.subscribe(player);

        await interaction.editReply({
            embeds: [new EmbedBuilder().setTitle(trackGet.title).setURL(trackGet.uri).setTimestamp()],
        });

        player.on("error", (error) => {
            console.error(error);
            interaction.editReply({ embeds: [errorEmbed] });
        });

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
    },
};

export default play;
