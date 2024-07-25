import {
    StringSelectMenuInteraction,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuComponentData,
    ActionRowBuilder,
} from "discord.js";
import { MusicDiscord, dataServer } from "../../utils/musicDiscord";
import App from "../../utils/discordBot";
import { playSong } from "../../commands/music/play";
import { SearchResult } from "moonlink.js";
import config from "../../config";

const selectMusic = {
    customId: "selectMusic",
    async exec(interaction: StringSelectMenuInteraction, app: App) {
        const query: string = interaction.values[0];
        const res: SearchResult = (await app.lavaClient?.search({ query, source: config.Lavalink.Source, requester: interaction.user.id })) as SearchResult;

        const track = res.tracks[0];

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        serverData.nextQueue.push(track);

        const disableMenu = new StringSelectMenuBuilder(interaction.component as StringSelectMenuComponentData)
            .setCustomId("selectMusic")
            .setPlaceholder(track.title)
            .setDisabled(true);
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(disableMenu);
        await interaction.message.edit({ components: [row] });

        await interaction.deferReply();
        if (serverData.nextQueue.length === 1) {
            await interaction.editReply({ content: "Memuat music..." });
            playSong(interaction, app, serverData);
        } else {
            await interaction.editReply({
                content: "",
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Music ditambahkan ke antrian." })
                        .setTitle(track.title)
                        .setURL(track.url)
                        .setColor("Green")
                        .setTimestamp(),
                ],
                components: [],
            });
        }
    },
};

export default selectMusic;
