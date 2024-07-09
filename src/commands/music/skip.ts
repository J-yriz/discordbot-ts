import App from "../../utils/discordBot";
import { playSong } from "./play";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";
import { firstResponse, nextResponse } from "./play";

const skip = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const connect = serverData.connection(userVoice, interaction);

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        if (serverData.nextQueue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music yang sedang diputar`,
                ephemeral: true,
            });

        if (serverData.nextQueue.length === 1) return await interaction.reply({ content: `Tidak ada antrian music`, ephemeral: true });

        if (nextResponse) nextResponse.delete();
        else if (firstResponse) firstResponse.delete();
        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Success").setDescription(`Main music selanjutnya ${serverData.nextQueue[0].title}`).setColor("Green")],
        });
        serverData.prevQueue.push(serverData.nextQueue[0]);
        serverData.nextQueue.shift();
        playSong(interaction, app, userVoice, connect);
    },
};

export default skip;
