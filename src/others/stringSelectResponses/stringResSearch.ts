import { StringSelectMenuInteraction, GuildMember, EmbedBuilder } from "discord.js";
import { checkVoice, dataServer } from "../../utils/musicDiscord";
import { MusicDiscord } from "../../utils/musicDiscord";
import App from "../../utils/discordBot";
import { playSong } from "../../commands/music/play";
import { responseChat } from "../../commands/music/search";
import { SearchResult } from "moonlink.js";

const selectMusic = {
    customId: "selectMusic",
    async exec(interaction: StringSelectMenuInteraction, app: App) {
        const query: string = interaction.values[0];
        const userVoice: string = checkVoice(interaction);
        const res: SearchResult = (await app.lavaClient?.search({ query, source: "youtube", requester: interaction.user.id })) as SearchResult;

        const track = res.tracks[0];

        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        serverData.nextQueue.push(track);

        responseChat.delete();
        await interaction.deferReply();
        if (serverData.nextQueue.length === 1) {
            playSong(interaction, app, userVoice, serverData);
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
