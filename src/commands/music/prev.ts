import App from "../../utils/discordBot";
import { playSong } from "./play";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";
import { firstResponse, nextResponse } from "./play";

const previus = {
    data: new SlashCommandBuilder()
        .setName("prev")
        .setDescription("Mainkan music sebelumnya")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const connect = serverData.connection(userVoice, interaction);

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        if (serverData.prevQueue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music sebelumnya`,
                ephemeral: true,
            });

        if (nextResponse) nextResponse.delete();
        else if (firstResponse) firstResponse.delete();
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle("Success").setDescription(`Mainkan music sebelumnya ${serverData.prevQueue[0].title}`).setColor("Green"),
            ],
        });
        serverData.nextQueue.unshift(serverData.prevQueue[0]);
        serverData.prevQueue.shift();
        playSong(interaction, app, userVoice, connect);
    },
};

export default previus;
