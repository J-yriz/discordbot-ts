import App from "../../utils/discordBot";
import { MusicDiscord, dataServer } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } from "discord.js";

const join = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Masuk ke voice channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const userVoice: string = serverData.voiceUser as string;

        serverData.playBot = serverData.playerBot(interaction, app, userVoice);
        serverData.playBot.connect({ setDeaf: true, setMute: false });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Join voice to <#${serverData.voiceUser}>`)
                    .setDescription(`Request ${interaction.user}`)
                    .setColor("Random"),
            ],
        });
    },
};

export default join;
