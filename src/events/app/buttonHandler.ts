import fs from "fs";
import path from "path";
import App from "../../utils/discordBot";
import { Button } from "../../utils/discordBot";

interface IImportButton {
    default: Button;
}

const buttonHandler = async (app: App, token: string, commands: any[]) => {
    if (!app) throw new Error("No app provided");

    const buttonFoldersPath = path.join(__dirname, "../../others/buttonResponses");
    const buttonFolders = fs.readdirSync(buttonFoldersPath);
    for (const buttonFolder of buttonFolders) {
        const buttonFiles = fs.readdirSync(`${buttonFoldersPath}/${buttonFolder}`);
        for (const buttonFile of buttonFiles) {
            const button: IImportButton = await import(`${buttonFoldersPath}/${buttonFolder}/${buttonFile}`);
            const { customId, exec }: Button = button.default;
            if (!customId || !exec) continue;
            app.buttonsCollection.set(customId, { customId, exec });
        }
    }
};

export default buttonHandler;
