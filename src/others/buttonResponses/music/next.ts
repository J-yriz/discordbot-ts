import { ChatInputCommandInteraction } from "discord.js";
import App from "../../../utils/discordBot";
import skip from "../../../commands/music/skip";

const nextSong = {
    customId: "next",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        skip.exec(interaction, app);
    },
};

export default nextSong;
