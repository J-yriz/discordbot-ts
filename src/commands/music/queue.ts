import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, GuildMember } from "discord.js";
import { MusicDiscord, dataServer, noVoiceChannel } from "../../utils/musicDiscord";

const queueMusic = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Menampilkan antrian music yang akan diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild: GuildMember = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember;
        const userVoice: string = guild?.voice.channel?.id as string;

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const queue = serverData.queue;

        if (queue.length === 0) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Tidak ada music yang sedang diputar")],
                ephemeral: true,
            });
        }

        if (queue.length === 1) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Tidak ada antraian music").setColor("Random")],
                ephemeral: true,
            });
        }

        const dataQueue = queue.map((e, i) => {
            return { name: `${e.title} | Posisi ${i}`, value: e.uri, inline: false };
        });

        dataQueue.shift();
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle(`Queue Music || Total Music: ${dataQueue.length}`).setColor("Random").addFields(dataQueue).setTimestamp(),
            ],
        });
    },
};

export default queueMusic;
