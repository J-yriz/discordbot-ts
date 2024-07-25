import { ChatInputCommandInteraction } from "discord.js";
import App from "../../../utils/discordBot";
import loop from "../../../commands/music/loop";

const loopSong = {
    customId: "loop",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        loop.exec(interaction, app);
    },
}

export default loopSong;