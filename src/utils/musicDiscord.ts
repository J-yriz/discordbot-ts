import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioResource,
    AudioPlayer,
    VoiceConnection,
} from "@discordjs/voice";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { IQueue } from "./interface";

export class MusicDiscord {
    original: IQueue[] = [];
    shuffle: IQueue[] = [];
    queue: IQueue[] = [];

    connection(userVoice: string, interaction: ChatInputCommandInteraction): VoiceConnection {
        return joinVoiceChannel({
            channelId: userVoice,
            guildId: interaction.guildId as string,
            adapterCreator: interaction.guild?.voiceAdapterCreator as any,
        });
    }

    resource(track: string): AudioResource {
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

// Embed
export const noVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Kamu harus berada di voice channel untuk menggunakan perintah ini")
    .setColor("DarkRed");
