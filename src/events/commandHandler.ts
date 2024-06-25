import fs from "fs";
import path from "path";
import App from "../utils/discordBot";
import regisSlashCommand from "./regisSlashCommand";
import { ChatInputCommandInteraction, Collection } from "discord.js";

export interface Command {
    data: {
        name: string;
        toJSON: () => any;
    };
    exec: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commandHandler = async (app: App, token: string, commands: any[]) => {
    if (!app) throw new Error("No app provided");

    app.commands = new Collection<string, Command>();

    const commandPath = path.join(__dirname, "../commands");
    const commandFolders = fs.readdirSync(commandPath);
    for (const commandFolder of commandFolders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${commandFolder}`));
        for (const commandFile of commandFiles) {
            const command = await import(`../commands/${commandFolder}/${commandFile}`);
            const { data, exec } = command.default;
            if (!data || !exec) continue;
            app.commands.set(data.name, { data, exec });
            commands.push(data.toJSON());
        }
    }
    regisSlashCommand(token, commands);
};

export default commandHandler;
