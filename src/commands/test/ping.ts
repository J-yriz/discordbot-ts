import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const ping = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with ping!')
        .setDMPermission(false)
		.setDefaultPermission(true),
	async exec(interaction: ChatInputCommandInteraction, client: any) {
		await interaction.reply({ content: 'Pong!', ephemeral: true});
	},
};

export default ping;