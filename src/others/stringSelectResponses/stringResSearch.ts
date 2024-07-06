import { StringSelectMenuInteraction, GuildMember, EmbedBuilder } from "discord.js";
import { getDetailVideo } from "../../api/lavalink/ytdl";
import { playSong } from "../../commands/music/play";
import { checkVoice, dataServer } from "../../utils/musicDiscord";
import { IQueue } from "../../utils/interface";
import { MusicDiscord } from "../../utils/musicDiscord";
import App from "../../utils/discordBot";

const selectMusic = {
    customId: "selectMusic",
    async exec(interaction: StringSelectMenuInteraction, app: App) {
        const value: string[] = interaction.values[0].split(",");
        const response = await getDetailVideo(value[0]);
        const userVoice: string = checkVoice(interaction);

        const track: IQueue = {
            title: response.title,
            uri: value[0],
            author: response.author,
            length: Number(value[1]),
        };

        const dataServerGet = dataServer.get(interaction.guildId as string);
        dataServerGet?.queue.push(track);
        const serverData: MusicDiscord = dataServerGet as MusicDiscord;

        if (serverData.queue.length === 1) {
            const connect = serverData.connection(userVoice, interaction);
            playSong(interaction, app, userVoice, connect);
        } else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Music ditambahkan ke antrian." })
                        .setTitle(track.title)
                        .setURL(track.uri)
                        .setColor("Green")
                        .setTimestamp(),
                ],
            });
        }
    },
};

export default selectMusic;
