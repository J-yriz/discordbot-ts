import App from "../../lib/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play any song you want")
        .addStringOption((option) => option
            .setName("query")
            .setDescription("The song you want to play")
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async exec(interaction: ChatInputCommandInteraction, client:App) {
        await interaction.reply({ embeds: [
            new EmbedBuilder()
            .setTitle("Playing")
        ]});
        // console.log(interaction.options.data[0].value);
    },
};

export default play;
