import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} from "discord.js";
import { queue } from "../../utils/musicDiscord";
import { AudioPlayer } from "@discordjs/voice";

const queueMusic = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Menampilkan antrian music yang akan diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {

        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Queue").setColor("Random")],
        });
    }
}

export default queueMusic;