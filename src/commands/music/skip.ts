import App from "../../utils/discordBot";
import { looping } from "./loop";
import { deleteResponse, playerBot, playSong, setSkipPrevCondition } from "./play";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";

const skip = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const userVoice: string = checkVoice(interaction);
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;

        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        if (serverData.nextQueue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music yang sedang diputar`,
                ephemeral: true,
            });

        if (serverData.nextQueue.length === 1) return await interaction.reply({ content: `Tidak ada antrian music`, ephemeral: true });

        deleteResponse();
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle("Success").setDescription(`Main music selanjutnya ${serverData.nextQueue[1].title}`).setColor("Green"),
            ],
        });
        if (!looping) {
            serverData.prevQueue.unshift(serverData.nextQueue[0]);
            serverData.nextQueue.shift();
            setSkipPrevCondition(true);
        }
        playerBot.stop();
    },
};

export default skip;
