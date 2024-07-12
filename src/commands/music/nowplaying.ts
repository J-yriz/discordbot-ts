import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, GuildMember } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { durationMusic } from "./play";
import { MoonlinkTrack } from "moonlink.js";

const nowplaying = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Menampilkan music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const queue: MoonlinkTrack[] = serverData.nextQueue;

        if (queue.length === 0) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Tidak ada music yang sedang diputar")],
                ephemeral: true,
            });
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Now Playing" })
                    .setTitle(`${queue[0].title}`)
                    .setURL(queue[0].url)
                    .addFields(
                        { name: "Author Music", value: `${queue[0].author}`, inline: true },
                        { name: "Durasi Music", value: `${durationMusic(queue[0].duration)}`, inline: true }
                    )
                    .setColor("Red")
                    .setTimestamp(),
            ],
        });
    },
};

export default nowplaying;
