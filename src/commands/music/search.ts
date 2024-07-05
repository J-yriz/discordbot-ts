import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from "discord.js";
import { durationMusic } from "./play";
import { MusicDiscord, checkVoice, dataServer, noVoiceChannel } from "../../utils/musicDiscord";
import { ITrackGet } from "../../utils/interface";
import trackGet from "../../api/lavalink/trackGet";

const search = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Cari music dengan beberapa pilihan")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addStringOption((option) => option.setName("song").setDescription("Music apa saja yang ingin kamu cari.").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const query: string = interaction.options.getString("song") as string;
        const trackGetData: ITrackGet[] = (await trackGet(query)).slice(0, 5);
        const userVoice: string = checkVoice(interaction);
        if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

        const options = trackGetData.map((e: ITrackGet, i: number): StringSelectMenuOptionBuilder => {
            return new StringSelectMenuOptionBuilder()
                .setLabel(`${i + 1}. ${e.info.title}`)
                .setDescription(e.info.author)
                .setValue(`${e.info.uri},${e.info.length}`);
        });
        const selectMusic = new StringSelectMenuBuilder()
            .setCustomId("selectMusic")
            .setPlaceholder("Pilih music yang ingin diputar")
            .addOptions(options);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMusic);
        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Result Search Music")
            .addFields(
                trackGetData.map((e: ITrackGet, i: number) => {
                    return {
                        name: `${i + 1}. ${e.info.title}`,
                        value: `Author: ${e.info.author}\nDuration: ${durationMusic(e.info.length)}`,
                    };
                })
            )
            .setColor("Random");

        try {
            await interaction.deferReply();
            interaction.editReply({
                content: "Pilih salah satu dari opsi di bawah ini:",
                embeds: [embed],
                components: [row],
            });
        } catch (error) {
            console.error(error);
        }
    },
};

export default search;
