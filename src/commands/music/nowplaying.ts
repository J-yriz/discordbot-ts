import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, GuildMember } from "discord.js";
import { MusicDiscord, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { durationMusic } from "./play";

const nowplaying = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Menampilkan music yang sedang diputar")
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

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Now Playing ${queue[0].title}`)
                    .setURL(queue[0].uri)
                    .addFields(
                        { name: "Author Music", value: `${queue[0].author}`, inline: true },
                        { name: "Durasi Music", value: `${durationMusic(queue[0].length)}`, inline: true }
                    )
                    .setColor("Red")
                    .setTimestamp(),
            ],
        });
    },
};

export default nowplaying;