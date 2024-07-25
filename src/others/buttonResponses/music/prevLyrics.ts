import { ChatInputCommandInteraction } from "discord.js";
import App from "../../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { row, lyric, lyricsEmbed, queueMusic } from "../../../commands/music/lyrics";

const prevLyrics = {
    customId: "prevLyrics",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        lyricsEmbed.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle(queueMusic.title)
                    .setURL(queueMusic.url)
                    .setThumbnail(queueMusic.artworkUrl)
                    .setDescription(lyric)
                    .setColor("Random")
                    .setTimestamp(),
            ],
            components: [row],
        });
    },
};

export default prevLyrics;
