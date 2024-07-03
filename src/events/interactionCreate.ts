import fs from "fs";
import path from "path";
import App from "../utils/discordBot";
import { MusicDiscord, dataServer } from "../utils/musicDiscord";
import { Events, EmbedBuilder } from "discord.js";

const InteractionCreate = (app: App, token: string, commands: any[]): void => {
    app.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand()) return;

        const musicCommands = path.join(__dirname, "../commands/music");
        const musicCommandName = fs.readdirSync(musicCommands);
        if (musicCommandName.includes(`${interaction.commandName}.js`)) {
            if (!dataServer.get(interaction.guildId as string)) {
                const dataNewPlayer: MusicDiscord = new MusicDiscord();
                dataServer.set(interaction.guildId as string, dataNewPlayer);
            }
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
