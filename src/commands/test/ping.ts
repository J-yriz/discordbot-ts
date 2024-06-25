import App from '../../utils/discordBot';
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

const ping = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with ping!')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	async exec(interaction: ChatInputCommandInteraction, client: App) {
		await interaction.reply({ content: 'Pong!', ephemeral: true});
	},
};

export default ping;