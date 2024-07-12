import fs from "fs";
import path from "path";
import App from "../../utils/discordBot";
import { Button } from "../../utils/discordBot";

interface IImportButton {
    default: Button;
}

const buttonHandler = async (app: App, token: string, commands: any[]) => {
    if (!app) throw new Error("No app provided");

    const buttonFolders = path.join(__dirname, "../../others/buttonResponses");
    const buttonFiles = fs.readdirSync(buttonFolders);
    for (const buttonFile of buttonFiles) {
        const button: IImportButton = await import(`${buttonFolders}/${buttonFile}`);
        const { customId, exec }: Button = button.default;
        if (!customId || !exec) continue;
        app.buttonsCollection.set(customId, { customId, exec });
    }
}

export default buttonHandler;