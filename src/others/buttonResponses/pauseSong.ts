import { ChatInputCommandInteraction } from "discord.js";
import App from "../../utils/discordBot";
import pause from "../../commands/music/pause";

const pauseSong = {
    customId: "pause",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        pause.exec(interaction, app);
    },
};

export default pauseSong;
