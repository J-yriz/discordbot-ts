import fs from "fs";
import path from "path";
import App from "../../utils/discordBot";
import regisSlashCommand from "./regisSlashCommand";
import { Command } from "../../utils/discordBot";

interface IImportCommand {
    default: Command;
}

const commandHandler = async (app: App, token: string, commands: any[]) => {
    if (!app) throw new Error("No app provided");

    const commandPath = path.join(__dirname, "../../commands");
    const commandFolders = fs.readdirSync(commandPath);
    for (const commandFolder of commandFolders) {
        const commandFiles = fs.readdirSync(`${commandPath}/${commandFolder}`);
        for (const commandFile of commandFiles) {
            const command: IImportCommand = await import(`${commandPath}/${commandFolder}/${commandFile}`);
            const { data, exec }: Command = command.default;
            if (!data || !exec) continue;
            app.commandsCollection.set(data.name, { data, exec });
            commands.push(data.toJSON());
        }
    }
    regisSlashCommand(token, commands);
};

export default commandHandler;
