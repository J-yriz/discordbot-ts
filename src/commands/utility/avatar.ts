import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

const avatar = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Replies with avatar!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("pengguna yang ingin dilihat avatar-nya")
                .setRequired(false)
                ),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const user = interaction.options.getUser("user") || interaction.user;
        await interaction.reply({
            embeds: [new EmbedBuilder().setDescription(`Avatar ${user}`).setImage(user.displayAvatarURL({ size: 2048 })).setColor("Random")],
        });
    },
};

export default avatar;
