import App from "../../utils/discordBot";
import { MusicDiscord, dataServer, checkVoice, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const join = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join the voice channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        serverData.connection(userVoice, interaction);
        await interaction.reply({ content: `Join to <#${userVoice}>`, ephemeral: true });
    },
};

export default join;
