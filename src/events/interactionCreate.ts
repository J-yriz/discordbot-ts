import { ChatInputCommandInteraction, Events } from "discord.js";

const InteractionCreate = (app: any, token: string, commands: any[]): void => {
    app.on(Events.InteractionCreate, async (interaction: ChatInputCommandInteraction) => {
        if (!interaction.isCommand()) return;

        const { commandName, client } = interaction;
        const command: any = app.commands.get(commandName);
        if (!command) return;

        try {
            await command.exec(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Terjadi error pada command Execute!", ephemeral: true });
        }
    });
};

export default InteractionCreate;
