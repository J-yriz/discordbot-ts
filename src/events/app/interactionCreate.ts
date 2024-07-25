import fs from "fs";
import path from "path";
import App, { Command, Button, StringSelect } from "../../utils/discordBot";
import { MusicDiscord, checkVoice, dataServer, noSameVoiceChannel, noVoiceChannel } from "../../utils/musicDiscord";
import { Events, EmbedBuilder, ChatInputCommandInteraction, ButtonInteraction } from "discord.js";

const InteractionCreate = (app: App, token: string, commands: any[]): void => {
    app.on(Events.InteractionCreate, async (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Terjadi Kesalahan pada Command!")
            .setFooter({ text: "Hubungi pembuat dari bot ini malmul_." })
            .setColor("DarkRed")
            .setTimestamp();

        const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
        if (interaction.isCommand()) {
            const { commandName } = interaction;

            // Show log command
            console.log(`[${waktu}] ${interaction.user.tag} menggunakan command ${commandName}`);

            const musicCommands = path.join(__dirname, "../../commands/music");
            const musicCommandName = fs.readdirSync(musicCommands);

            if (musicCommandName.includes(`${commandName}.js`)) {
                if (!checkVoice(interaction as ChatInputCommandInteraction)) return await interaction.reply({ embeds: [noVoiceChannel] });

                let serverData = dataServer.get(interaction.guildId as string) as MusicDiscord;
                if (!serverData) {
                    const dataNewPlayer: MusicDiscord = new MusicDiscord();
                    dataServer.set(interaction.guildId as string, dataNewPlayer);
                    serverData = dataServer.get(interaction.guildId as string) as MusicDiscord;
                    serverData.voiceUser = checkVoice(interaction as ChatInputCommandInteraction);
                } else {
                    if (serverData.voiceUser !== checkVoice(interaction as ChatInputCommandInteraction)) {
                        return await interaction.reply({ embeds: [noSameVoiceChannel], ephemeral: true });
                    }
                }
            }

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
            const { customId } = interaction;
            const button: Button = app.buttonsCollection.get(customId) as Button;
            if (!button) return;

            // Show log button
            console.log(`[${waktu}] ${interaction.user.tag} menggunakan button ${customId}`);

            const buttonFoldersPath = path.join(__dirname, "../../others/buttonResponses/music");
            const buttonFolders = fs.readdirSync(buttonFoldersPath);

            if (buttonFolders.includes(`${customId}.js`)) {
                let serverData = dataServer.get(interaction.guildId as string) as MusicDiscord;
                if (serverData.voiceUser !== checkVoice(interaction as ButtonInteraction)) {
                    return await interaction.reply({ embeds: [noSameVoiceChannel], ephemeral: true });
                }
            }

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

            // Show log select
            console.log(`[${waktu}] ${interaction.user.tag} menggunakan pilihan opsi ${interaction.customId}`);

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
