import { SlashCommandBuilder } from 'discord.js';

const ping = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with ping!')
        .setDMPermission(false),
	async exec(interaction: any, client: any) {
		await interaction.reply({ content: 'Pong!', ephemeral: true});
	},
};

export default ping;