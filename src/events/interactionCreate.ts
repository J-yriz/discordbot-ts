import fs from "fs";
import path from "path";
import App, { Command, Button, StringSelect } from "../utils/discordBot";
import { MusicDiscord, dataServer } from "../utils/musicDiscord";
import { Events, EmbedBuilder } from "discord.js";
const InteractionCreate = (app: App, token: string, commands: any[]): void => {
    app.on(Events.InteractionCreate, async (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Terjadi Kesalahan pada Command!")
            .setFooter({ text: "Hubungi pembuat dari bot ini malmul_." })
            .setColor("DarkRed")
            .setTimestamp();

        if (interaction.isCommand()) {
            const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
            const musicCommands = path.join(__dirname, "../commands/music");
            const musicCommandName = fs.readdirSync(musicCommands);

            console.log(`[${waktu}] ${interaction.user.tag} menggunakan command ${interaction.commandName}`);
            
            if (musicCommandName.includes(`${interaction.commandName}.js`)) {
                if (!dataServer.get(interaction.guildId as string)) {
                    const dataNewPlayer: MusicDiscord = new MusicDiscord();
                    dataServer.set(interaction.guildId as string, dataNewPlayer);
                }
            }

            const { commandName } = interaction;
            const command: any = app.commandsCollection.get(commandName) as Command;
            if (!command) return;

            try {
                await command.exec(interaction, app);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            const button: Button = app.buttonsCollection.get(interaction.customId) as Button;
            if (!button) return;

            try {
                await button.exec(interaction, app);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
        } else if (interaction.isStringSelectMenu()) {
            const selectString: StringSelect = app.stringSelectCollection.get(interaction.customId) as StringSelect;
            if (!selectString) return;

            try {
                await selectString.exec(interaction, app);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
        }
    });
};

export default InteractionCreate;
