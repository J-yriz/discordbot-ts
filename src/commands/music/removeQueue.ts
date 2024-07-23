import App from "../../utils/discordBot";
import { durationMusic } from "./play";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";

const removeQueue = {
    data: new SlashCommandBuilder()
        .setName("removequeue")
        .setDescription("Hapus music dari antrian")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addIntegerOption((option) => option.setName("antrian").setDescription("Nomor antrian music yang ingin dihapus").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const indexQueue: number = interaction.options.getInteger("antrian") as number;
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        if (serverData.nextQueue.length === 0) {
            return await interaction.reply({
                content: `Tidak ada music yang sedang diputar`,
                ephemeral: true,
            });
        }
        if (serverData.nextQueue.length === 1) return await interaction.reply({ content: `Tidak ada antrian music`, ephemeral: true });
        if (indexQueue < serverData.nextQueue.length) {
            const queueSave = serverData.nextQueue[indexQueue];
            serverData.nextQueue.splice(indexQueue, 1);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Berhasil menghapus music" })
                        .setTitle(`${queueSave.title}`)
                        .setURL(queueSave.url)
                        .setThumbnail(queueSave.artworkUrl)
                        .addFields(
                            { name: "Author Music", value: `${queueSave.author}`, inline: true },
                            { name: "Durasi Music", value: `${durationMusic(queueSave.duration)}`, inline: true }
                        )
                        .setColor("Red")
                        .setTimestamp(),
                ],
            });
        } else {
            await interaction.reply({ content: `Nomor antrian tidak ditemukan` });
        }
    },
};

export default removeQueue;
