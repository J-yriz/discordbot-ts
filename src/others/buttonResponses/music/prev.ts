import { ChatInputCommandInteraction } from "discord.js";
import App from "../../../utils/discordBot";
import previus from "../../../commands/music/prev";

const prevSearch = {
    customId: "prev",
    async exec (interaction: ChatInputCommandInteraction, app: App) {
        previus.exec(interaction, app);
    },
};

export default prevSearch;