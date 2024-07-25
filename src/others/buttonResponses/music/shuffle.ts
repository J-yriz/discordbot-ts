import { ChatInputCommandInteraction } from "discord.js";
import App from "../../../utils/discordBot";
import shuffle from "../../../commands/music/shuffle";

const shuffleSong = {
    customId: "shuffle",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        shuffle.exec(interaction, app);
    },
}

export default shuffleSong;