import { ChatInputCommandInteraction } from "discord.js";
import App from "../../utils/discordBot";
import lyrics from "../../commands/music/lyrics";

const lyricsSong = {
    customId: "lyrics",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        lyrics.exec(interaction, app);
    },
};

export default lyricsSong;
