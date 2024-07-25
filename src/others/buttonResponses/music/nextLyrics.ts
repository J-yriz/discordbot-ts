import { ChatInputCommandInteraction } from "discord.js";
import App from "../../../utils/discordBot";
import { EmbedBuilder } from "discord.js";
import { row, sisaLyrics, lyricsEmbed, queueMusic } from "../../../commands/music/lyrics";

const nextLyrics = {
    customId: "nextLyrics",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        lyricsEmbed.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle(queueMusic.title)
                    .setURL(queueMusic.url)
                    .setThumbnail(queueMusic.artworkUrl)
                    .setDescription(sisaLyrics)
                    .setColor("Random")
                    .setTimestamp(),
            ],
            components: [row],
        });
    },
};

export default nextLyrics;
