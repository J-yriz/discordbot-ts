import fs from "fs";
import path from "path";
import App from "../../utils/discordBot";
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

const commandFolderPath = path.join(__dirname, "..");
const commandFiles = fs.readdirSync(commandFolderPath);
const commandOptions = commandFiles.map((file) => {
    return {
        name: file,
        value: file,
    };
});

const help = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Menampilkan bantuan command")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption((option) => option.setName("command").setDescription("Pilih command").setRequired(true).addChoices(commandOptions))
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const command = interaction.options.getString("command") as string;
        const helpData = fs.readFileSync(`./json/help.json`, "utf-8");
        const helpJson = JSON.parse(helpData);
        const commandData = helpJson[command];
        const helpEmbed = Object.keys(commandData).map((key) => {
            return {
                name: fistCaps(key),
                value: commandData[key],
                inline: false,
            };
        });

        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle(`Help commands ${fistCaps(command)}`).addFields(helpEmbed).setColor("Random").setTimestamp()],
        });
    },
};

function fistCaps(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default help;
