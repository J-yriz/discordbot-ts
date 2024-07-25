import { ChatInputCommandInteraction } from "discord.js";
import App from "../../../utils/discordBot";
import { setLyricsEmbedUndi } from "../../../commands/music/lyrics";

const deleteLyrics = {
    customId: "deleteLyrics",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        setLyricsEmbedUndi();
    },
}

export default deleteLyrics;