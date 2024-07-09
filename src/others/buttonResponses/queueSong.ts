import { ChatInputCommandInteraction } from "discord.js";
import App from "../../utils/discordBot";
import queueMusic from "../../commands/music/queue";

const queueSong = {
    customId: "queue",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        queueMusic.exec(interaction, app);
    },
}

export default queueSong;