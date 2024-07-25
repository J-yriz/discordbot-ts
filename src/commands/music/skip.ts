import App from "../../utils/discordBot";
import { looping } from "./loop";
import { deleteResponse, setSkipPrevCondition } from "./play";
import { MusicDiscord, dataServer } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";

const skip = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip music yang sedang diputar")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {        
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const playerBot = serverData.playBot;

        if (serverData.nextQueue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music yang sedang diputar`,
                ephemeral: true,
            });

        if (serverData.nextQueue.length === 1) return await interaction.reply({ content: `Tidak ada antrian music`, ephemeral: true });

        deleteResponse(serverData);
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
