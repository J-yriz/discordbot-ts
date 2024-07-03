import App from "../../utils/discordBot";
import { playSong } from "./play";
import { looping } from "./loop";
import { MusicDiscord, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";

const skip = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild: GuildMember = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember;
        const userVoice: string = guild?.voice.channel?.id as string;
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const connect = serverData.connection(userVoice, interaction);
        const playerBot = serverData.playerBot();

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        if (serverData.queue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music yang sedang diputar`,
                ephemeral: true,
            });

        if (serverData.queue.length === 1) return await interaction.reply({ content: `Tidak ada antrian music`, ephemeral: true });

        await interaction.reply({
            embeds: [new EmbedBuilder().setTitle("Success").setDescription(`Skip music ${serverData.queue[0].title}`).setColor("Green")],
        });
        serverData.queue.shift();
        playSong(serverData, playerBot, interaction, app, userVoice, connect);
    },
};

export default skip;
