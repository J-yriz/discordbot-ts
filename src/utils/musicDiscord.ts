import App from "./discordBot";
import { MoonlinkPlayer, MoonlinkTrack } from "moonlink.js";
import { ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuInteraction, Message, ButtonInteraction } from "discord.js";
import config from "../config";

export class MusicDiscord {
    // Queue Music
    public original: MoonlinkTrack[] = [];
    public shuffle: MoonlinkTrack[] = [];
    public prevQueue: MoonlinkTrack[] = [];
    public nextQueue: MoonlinkTrack[] = [];

    // Data and Option Music
    public firstResponse? : Message<boolean>
    public nextResponse? : Message<boolean>
    public interaction: ChatInputCommandInteraction | StringSelectMenuInteraction = {} as ChatInputCommandInteraction | StringSelectMenuInteraction;
    public playBot: MoonlinkPlayer = {} as MoonlinkPlayer;

    public voiceUser?: string;

    playerBot(interaction: ChatInputCommandInteraction | StringSelectMenuInteraction, app: App, userVoice: string): MoonlinkPlayer {
        return app.lavaClient?.players.create({
            guildId: interaction.guildId as string,
            voiceChannel: userVoice,
            textChannel: interaction.channelId,
            autoPlay: config.Lavalink.autoPlay,
            volume: 100,
        }) as MoonlinkPlayer;
    }
}

export const dataServer = new Map<string, MusicDiscord>();

export const checkVoice = (interaction: ChatInputCommandInteraction | StringSelectMenuInteraction | ButtonInteraction): string => {
    const guild = interaction.guild?.members.cache.get(interaction.user.id);
    return guild?.voice.channel?.id as string;
};

// Embed
export const noVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Kamu harus berada di voice channel untuk menggunakan perintah ini")
    .setColor("DarkRed");

export const noSameVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Sepertinya bot sedang digunakan di voice channel lain")
    .setColor("DarkRed");