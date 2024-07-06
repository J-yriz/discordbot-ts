import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    Message,
    EmbedBuilder,
} from "discord.js";
import { durationMusic } from "./play";
import { checkVoice, noVoiceChannel } from "../../utils/musicDiscord";
import { ITrackGet } from "../../utils/interface";
import trackGet from "../../api/lavalink/trackGet";

export let responseChat: Message<boolean>;
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
                .setLabel(
                    `${i + 1}. ${e.info.title}`
                        .replace(/#\w+/g, "")
                        .replace(/\s{2,}/g, " ")
                        .trim()
                )
                .setDescription(`${durationMusic(e.info.length)} | ${e.info.author}`)
                .setValue(`${e.info.uri},${e.info.length}`);
        });
        const selectMusic = new StringSelectMenuBuilder()
            .setCustomId("selectMusic")
            .setPlaceholder("Pilih music yang ingin diputar")
            .addOptions(options);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMusic);

        try {
            await interaction.deferReply({ fetchReply: true });
            responseChat = await interaction.editReply({
                content: "Pilih salah satu lagu di bawah ini:",
                components: [row],
            });
            try {
                const filter = (i: any) => i.user.id === interaction.user.id;
                await responseChat.awaitMessageComponent({ filter, time: 30000 });
            } catch (e) {
                await interaction.deleteReply();
            }
        } catch (error) {
            console.error(error);
        }
    },
};

export default search;
