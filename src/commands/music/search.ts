import App from "../../utils/discordBot";
import {
    ChatInputCommandInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    EmbedBuilder,
    Message,
} from "discord.js";
import { durationMusic } from "./play";
import { checkVoice, noVoiceChannel } from "../../utils/musicDiscord";
import { MoonlinkTrack, SearchResult } from "moonlink.js";
import config from "../../config";

export let responseChat: Message<boolean>;
const search = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Cari music dengan beberapa pilihan")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false)
        .addStringOption((option) => option.setName("song").setDescription("Music apa saja yang ingin kamu cari.").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        try {
            await interaction.deferReply({ fetchReply: true });
            const query: string = interaction.options.getString("song") as string;

            let res: SearchResult;
            const node = app.lavaClient?.nodes.get(config.Lavalink.nodeName);
            if (node.state === "READY") {
                res = (await app.lavaClient?.search({
                    query,
                    source: "youtube",
                    requester: interaction.user.id,
                })) as SearchResult;
            } else {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder().setTitle("Lavalink tidak terhubung!").setDescription("Silahkan tunggu beberapa waktu.").setColor("Random"),
                    ],
                });
            }

            const trackGetData: MoonlinkTrack[] = res.tracks.slice(0, 5);

            const userVoice: string = checkVoice(interaction);
            if (!userVoice) return await interaction.reply({ embeds: [noVoiceChannel], ephemeral: true });

            if (query.includes("https://") && !query.includes("youtube.com"))
                return await interaction.reply({ content: "Tolong berikan link dari youtube.", ephemeral: true });

            const options = trackGetData.map((e: MoonlinkTrack, i: number): StringSelectMenuOptionBuilder => {
                let name: string = `${i + 1}. ${e.title}`
                    .replace(/#\w+/g, "")
                    .replace(/\s{2,}/g, " ")
                    .trim();
                // try to check if the name is more than 100 characters
                if (name.length > 100) name = name.slice(0, 100);
                return new StringSelectMenuOptionBuilder()
                    .setLabel(name)
                    .setDescription(`${durationMusic(e.duration)} | ${e.author}`)
                    .setValue(name);
            });
            const selectMusic = new StringSelectMenuBuilder()
                .setCustomId("selectMusic")
                .setPlaceholder("Pilih music yang ingin diputar")
                .addOptions(options);

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMusic);

            responseChat = await interaction.editReply({
                content: "Pilih salah satu lagu di bawah ini:",
                components: [row],
            });

            try {
                const filter = (i: any) => i.user.id === interaction.user.id;
                await responseChat.awaitMessageComponent({ filter, time: 30000 });
            } catch (e) {
                await responseChat.edit({ content: "Waktu habis, silahkan ulangi lagi.", components: [] });
                setTimeout(() => {
                    responseChat.delete();
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        }
    },
};

export default search;
