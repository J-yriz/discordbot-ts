import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioResource,
    AudioPlayer,
    VoiceConnection,
} from "@discordjs/voice";
import { ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { IQueue } from "./interface";
import { Readable } from "stream";

export class MusicDiscord {
    original: IQueue[] = [];
    shuffle: IQueue[] = [];
    queue: IQueue[] = [];

    connection(userVoice: string, interaction: ChatInputCommandInteraction | StringSelectMenuInteraction): VoiceConnection {
        return joinVoiceChannel({
            channelId: userVoice,
            guildId: interaction.guildId as string,
            adapterCreator: interaction.guild?.voiceAdapterCreator as any,
        });
    }

    resource(track: Readable): AudioResource {
        return createAudioResource(track, { inlineVolume: true });
    }

    playerBot(): AudioPlayer {
        return createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
    }
}

export const dataServer = new Map<string, MusicDiscord>();

export const checkVoice = (interaction: ChatInputCommandInteraction | StringSelectMenuInteraction): string => {
    const guild = interaction.guild?.members.cache.get(interaction.user.id);
    return guild?.voice.channel?.id as string;
};

// Embed
export const noVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Kamu harus berada di voice channel untuk menggunakan perintah ini")
    .setColor("DarkRed");
