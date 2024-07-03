import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

const help = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Menampilkan bantuan command")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Help Command")
                    .setDescription("This is a help command")
                    .setColor("Random")
                    .setTimestamp(),
            ],
            ephemeral: true,
        });
    },
};

export default help;
