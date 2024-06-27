import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

const ping = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with ping!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle(`${app.ws.ping}ms`).setTimestamp()],
            ephemeral: true,
        });
    },
};

export default ping;
