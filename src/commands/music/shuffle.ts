import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { MusicDiscord, dataServer } from "../../utils/musicDiscord";
import { MoonlinkTrack } from "moonlink.js";

let shuffleMode: boolean = false;
const shuffle = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Acak antrian music")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const queue: MoonlinkTrack[] = serverData.nextQueue;

        if (queue.length === 0) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Tidak ada music yang sedang diputar").setColor("Random")],
                ephemeral: true,
            });
        }

        if (queue.length < 4) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Usahakan antrian lagu lebih dari 4.").setColor("Random")],
                ephemeral: true,
            });
        }

        if (!shuffleMode) {
            shuffleMode = true;
            serverData.original = [...queue.slice(1)];
            const nowPlay: MoonlinkTrack = queue.shift() as MoonlinkTrack;
            for (let i = queue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [queue[i], queue[j]] = [queue[j], queue[i]];
            }
            queue.unshift(nowPlay);
        } else {
            shuffleMode = false;
            queue.length = 0;
            queue.push(...serverData.original);
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Shuffle ${shuffleMode ? "dihidupkan" : "dimatikan"}`)
                    .setDescription(queue[0].title)
                    .setColor("Random")
                    .setTimestamp(),
            ],
        });
        setTimeout(() => {
            interaction.deleteReply();
        }, 60000);
    },
};

export default shuffle;
