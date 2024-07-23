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
        let array: string[] = [];
        const map1: Map<string, number> = new Map<string, number>();

        map1.set("a", 1);
        map1.set("b", 2);
        map1.set("c", 3);
        for (const key of map1.keys()) {
            console.log(key);
            array.push(key);
        }
        console.log(array);
        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Help Command").setDescription("This is a help command").setColor("Random").setTimestamp()],
            ephemeral: true,
        });
    },
};

export default help;
