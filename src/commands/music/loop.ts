import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";

export let looping: boolean = false;
const loop = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Mengulang music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const queue = serverData.nextQueue;

        if (queue.length === 0) {
            return await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Tidak ada music yang sedang diputar")],
                ephemeral: true,
            });
        }

        changeLoop(!looping);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Looping Music ${looping ? "dihidupkan" : "dimatikan"}`)
                    .setDescription(queue[0].title)
                    .setColor("Random")
                    .setTimestamp(),
            ],
        });
    },
};

export const changeLoop = (status: boolean): void => {
    looping = status;
};

export default loop;
