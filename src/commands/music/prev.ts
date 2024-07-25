import App from "../../utils/discordBot";
import { looping } from "./loop";
import { deleteResponse, setSkipPrevCondition } from "./play";
import { MusicDiscord, dataServer } from "../../utils/musicDiscord";
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, GuildMember } from "discord.js";

const previus = {
    data: new SlashCommandBuilder()
        .setName("prev")
        .setDescription("Mainkan music sebelumnya")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const serverData: MusicDiscord = dataServer.get(interaction.guildId as string) as MusicDiscord;
        const playerBot = serverData.playBot;
        
        if (serverData.prevQueue.length === 0)
            return await interaction.reply({
                content: `Tidak ada music sebelumnya`,
                ephemeral: true,
            });

        deleteResponse(serverData);
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
