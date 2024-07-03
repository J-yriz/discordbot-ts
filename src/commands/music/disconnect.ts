import { VoiceConnection } from "@discordjs/voice";
import App from "../../utils/discordBot";
import { changeLoop } from "./loop";
import { MusicDiscord, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, GuildMember } from "discord.js";

const disconnect = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect the bot from the voice channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const guild: GuildMember = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember;
        const userVoice: string = guild?.voice.channel?.id as string;
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const connect: VoiceConnection = serverData.connection(userVoice, interaction);
        await interaction.reply({ content: `Disconnected from <#${userVoice}>`, ephemeral: true });
        connect.destroy();
        changeLoop(false);
        dataServer.delete(interaction.guildId as string);
    },
};

export default disconnect;
