import App from "../../utils/discordBot";
import { SearchResult } from "erela.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption((option) => option.setName("song").setDescription("The song you want to play").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const query = interaction.options.getString("song");
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;
        if (!userVoice) {
            return await interaction.reply({ content: "You need to join a voice channel first!", ephemeral: true });
        }
        app.manager.init(app.user?.id);
        const player = app.manager.create({
            guild: `${interaction.guildId}`,
            voiceChannel: `${userVoice}`,
            textChannel: `${interaction.channelId}`,
            selfDeafen: true,
        });
        await interaction.reply({ content: "Search...", ephemeral: true });
        const music: SearchResult = await app.manager.search(`${query}`, interaction.user);
        if (music.loadType === "NO_MATCHES" || music.loadType === "LOAD_FAILED") return await interaction.editReply({ content: "No songs found!" });
        const track = music.tracks[0];
        player.connect();
        player.play(track);
        if (!player.playing && !player.paused) player.pause(false);
        await interaction.editReply({ content: `Playing: ${track.title}` });
    },
};

export default play;
