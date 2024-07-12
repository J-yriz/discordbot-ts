import App from "../../utils/discordBot";
import { looping } from "./loop";
import { deleteResponse, playerBot, playSong, setSkipPrevCondition } from "./play";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";

const previus = {
    data: new SlashCommandBuilder()
        .setName("prev")
        .setDescription("Mainkan music sebelumnya")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        if (serverData.prevQueue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music sebelumnya`,
                ephemeral: true,
            });

        deleteResponse();
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle("Success").setDescription(`Mainkan music sebelumnya ${serverData.prevQueue[0].title}`).setColor("Green"),
            ],
        });
        if (!looping) {
            serverData.nextQueue.unshift(serverData.prevQueue[0]);
            serverData.prevQueue.shift();
            setSkipPrevCondition(true);
        }
        playerBot.stop();
    },
};

export default previus;
