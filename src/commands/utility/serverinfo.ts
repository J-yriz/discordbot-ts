import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

const serverinfo = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Menampilkan informasi server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Server Info • ${interaction.guild?.name}`)
                    .setThumbnail(interaction.guild?.iconURL({ size: 2048 }) as string)
                    .addFields(
                        { name: "Owner", value: `<@${interaction.guild?.ownerId}>`, inline: true },
                        { name: "Server ID", value: `${interaction.guild?.id}`, inline: true },
                        { name: "Member Count", value: `${interaction.guild?.memberCount}`, inline: true },
                        { name: "Channel Count", value: `${interaction.guild?.channels.cache.size}`, inline: true },
                        { name: "Role Count", value: `${interaction.guild?.roles.cache.size}`, inline: true },
                        { name: "Created At", value: `${interaction.guild?.createdAt.toDateString()}`, inline: true },
                        { name: "Roles", value: `${interaction.guild?.roles.cache.map((role) => role).join(" ")}`, inline: false },
                    )
                    .setColor("Random"),
            ],
        });
    },
};

export default serverinfo;
