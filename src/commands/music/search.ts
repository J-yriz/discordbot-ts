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
import Wait from "node:timers/promises";
import { durationMusic } from "./play";
import { checkVoice, noVoiceChannel } from "../../utils/musicDiscord";
import { ITrackGet } from "../../utils/interface";
import trackGet from "../../api/lavalink/trackGet";

export let responseChat: Message<boolean>;
const wait = Wait.setTimeout;
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
            let name: string = `${i + 1}. ${e.info.title}`
                .replace(/#\w+/g, "")
                .replace(/\s{2,}/g, " ")
                .trim();
            // try to check if the name is more than 100 characters
            if (name.length > 100) name = name.slice(0, 100);
            return new StringSelectMenuOptionBuilder()
                .setLabel(name)
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
            await wait(3000);
            responseChat = await interaction.editReply({
                content: "Pilih salah satu lagu di bawah ini:",
                components: [row],
            });
            try {
                const filter = (i: any) => i.user.id === interaction.user.id;
                await responseChat.awaitMessageComponent({ filter, time: 30000 });
            } catch (e) {
                await interaction.editReply({ content: "Terlalu lama untuk memilih music, pilihan di hapus", components: [] });
                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        }
    },
};

export default search;
