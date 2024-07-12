import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextBasedChannelFields } from "discord.js";

const purge = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Menghapus chat sesuai jumlah!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) => option.setName("jumlah").setDescription("Jumlah chat yang ingin dihapus").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const jumlah = interaction.options.getInteger("jumlah") as number;
        if (jumlah < 1 || jumlah > 100)
            return await interaction.reply({
                embeds: [new EmbedBuilder().setTitle("Error").setDescription("Jumlah chat harus diantara 1-100").setColor("Random")],
            });

        await (interaction.channel as TextBasedChannelFields).bulkDelete(jumlah);
        await interaction.reply({ content: `Berhasil menghapus ${jumlah} chat!`, ephemeral: true });
    },
};

export default purge;
