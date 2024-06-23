import fs from "fs";
import regisSlashCommand from "./regisSlashCommand";
import { ChatInputCommandInteraction, Collection } from "discord.js";

export interface Command {
    data: {
        name: string;
        toJSON: () => any;
    };
    exec: (interaction: ChatInputCommandInteraction) => void;
}

const commandHandler = async (app: any, token: string, commands: any[]) => {
    if (!app) throw new Error("No app provided");

    app.commands = new Collection<string, Command>();

    const commandFolder: string[] = fs.readdirSync("./src/commands");
    for (const folder of commandFolder) {
        const commandFiles: string[] = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".ts"));
        for (const file of commandFiles) {
            const files = file.replace(".ts", "");
            const commandsFile = await import(`../commands/${folder}/${files}`);
            const command: Command = commandsFile.default;

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
