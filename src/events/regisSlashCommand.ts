import config from "../config";
import { REST, Routes } from "discord.js";

const clientID: any = config.ClientID;

const regisSlashCommand = async (token: string, commands: any) => {
    const rest = new REST().setToken(token);

    (async () => {
        try {
            const data: any = await rest.put(
                Routes.applicationCommands(clientID),
                { body: commands }
            )

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
};

export default regisSlashCommand;
