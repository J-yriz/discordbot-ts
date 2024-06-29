import fs from "fs";
import path from "path";
import App from "../utils/discordBot";
import { Events, EmbedBuilder } from "discord.js";

const InteractionCreate = (app: App, token: string, commands: any[]): void => {
    app.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand()) return;

        const guildData = fs.readdirSync('./json/guilds/');
        if (!guildData.includes(`${interaction.guildId}.json`)) {
            fs.writeFileSync(
                `./json/guilds/${interaction.guildId}.json`,
                JSON.stringify({ serverName: interaction.guild?.name, queueMusic: [] }, null, 2)
            );
        }

        const { commandName, client } = interaction;
        const command: any = app.commands.get(commandName);
        if (!command) return;

        try {
            await command.exec(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Terjadi Kesalahan pada Command!")
                        .setFooter({ text: "Hubungi pembuat dari bot ini malmul_." })
                        .setColor("DarkRed")
                        .setTimestamp(),
                ],
                ephemeral: true,
            });
        }
    });
};

export default InteractionCreate;
