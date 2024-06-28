import {
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioResource,
} from "@discordjs/voice";
import { ChatInputCommandInteraction } from "discord.js";

export default class Music {

    queue: AudioResource[] = [];

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
        return createAudioResource(track, { inlineVolume: true});
    }

    set queueTrack(track: AudioResource) {
        this.queue.push(track);
    }

}
