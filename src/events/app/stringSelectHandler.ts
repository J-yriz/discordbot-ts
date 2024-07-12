import fs from "fs";
import path from "path";
import App, { StringSelect } from "../../utils/discordBot";

interface IImportStringSelect {
    default: StringSelect;
}

const stringSelectHandler = async (app: App, token: string, commands: any[]) => {
    if (!app) throw new Error("No app provided");

    const stringSelectFolders = path.join(__dirname, "../../others/stringSelectResponses");
    const stringSelectFiles = fs.readdirSync(stringSelectFolders);
    for (const stringSelectFile of stringSelectFiles) {
        const stringSelect: IImportStringSelect = await import(`${stringSelectFolders}/${stringSelectFile}`);
        const { customId, exec }: StringSelect = stringSelect.default;
        if (!customId || !exec) continue;
        app.stringSelectCollection.set(customId, { customId, exec });
    }
};

export default stringSelectHandler;
