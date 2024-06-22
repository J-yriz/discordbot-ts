import fs from "fs";
import regisSlashCommand from "./regisSlashCommand";
import { ChatInputCommandInteraction, Events, Collection } from "discord.js";

const commandHandler = async (app: any, token: string, commands: any) => {
    if (!app) throw new Error("No app provided");

    app.commands = new Collection();

    const commandFolder = fs.readdirSync("./src/commands");
    for (const folder of commandFolder) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".ts"));
        for (const file of commandFiles) {
            const files = file.replace(".ts", "");
            const commandsFile = await import(`../commands/${folder}/${files}`);
            const command = commandsFile.default;

            if ("data" in command && "exec" in command) {
                app.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            } else {
                console.log(`Error: ${file} is not a valid command`);
            }
        }
    }
    
    console.log("Commands loaded");
    await regisSlashCommand(token, commands);
};

export default commandHandler;
