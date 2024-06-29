import {
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioResource,
} from "@discordjs/voice";
import { ChatInputCommandInteraction } from "discord.js";
import { IQueue } from "./interface";

export default class Music {
    queue: IQueue[] = [];

    connection(userVoice: string, interaction: ChatInputCommandInteraction) {
        return joinVoiceChannel({
            channelId: userVoice,
            guildId: interaction.guildId as string,
            adapterCreator: interaction.guild?.voiceAdapterCreator as any,
        });
    }
    player() {
        return createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
    }
    resource(track: string) {
        return createAudioResource(track, { inlineVolume: true });
    }

    set setQueueTrack(track: IQueue) {
        this.queue.push(track);
    }
}
