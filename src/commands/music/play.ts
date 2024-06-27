import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import Music from "../../utils/musicDiscord";

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
        await interaction.reply({ embeds: [new EmbedBuilder().setTitle("Searching for the song...")] });
        const trackGet = await app.lavaClient(query);
        if (trackGet === "No tracks found")
            return await interaction.editReply({ embeds: [new EmbedBuilder().setTitle("No tracks found")] });
        const playTrack = app.lavaPlay(trackGet.uri);
        const music: Music = new Music();
        music.setConnect(userVoice, interaction);
        music.setTrack(playTrack);
        music.player.play(music.resource);
        music.connection.subscribe(music.player);
        await interaction.editReply({
            embeds: [new EmbedBuilder().setTitle(trackGet.title).setURL(trackGet.uri).setTimestamp()],
        });

        music.player.on("error", (error) => {
            console.error(error);
            interaction.editReply({ embeds: [errorEmbed] });
        });

        music.player.on(AudioPlayerStatus.Idle, () => {
            console.log("Player is idle");
            music.connection.destroy();
        });
    },
};

export default play;
