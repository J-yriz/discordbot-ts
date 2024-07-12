import fs from "fs";
import path from "path";
import App, { Command } from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

import config from "../../config";
import regisSlashCommand from "../../events/app/regisSlashCommand";
const { Token } = config;

const reload = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload command")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption((option) => option.setName("command").setDescription("Command yang ingin di reload").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const commandName: string = interaction.options.getString("command") as string;
        const commandsPathFolder: string = path.join(__dirname, "../../commands");
        const commandsFolder: string[] = fs.readdirSync(commandsPathFolder);
        for (const commandFolder of commandsFolder) {
            const commands: string[] = fs.readdirSync(`${commandsPathFolder}/${commandFolder}`);
            for (const files of commands) {
                if (files === `${commandName.toLowerCase()}.js`) {
                    try {
                        const command: {default: any} = await import(`${commandsPathFolder}/${commandFolder}/${commandName}`);
                        const { data, exec }: Command = command.default;
                        app.commandsCollection.set(data.name, {data, exec});
                        await interaction.reply({ content: `Command ${commandName} berhasil di reload!` });
                        regisSlashCommand(Token as string, app.commands);
                        return;
                    } catch (error) {
                        console.log(error);
                        await interaction.reply({ embeds: [new EmbedBuilder().setTitle("Error").setDescription("Terjadi kesalahan pada command!").setColor("Random")] });
                        return;
                    }
                }
            }
        }
    },
}

export default reload;