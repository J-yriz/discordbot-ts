import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    NoSubscriberBehavior,
} from "@discordjs/voice";
import { ChatInputCommandInteraction } from "discord.js";

export default class Music {

    private userVoice: string = '';
    private interaction: ChatInputCommandInteraction = {} as ChatInputCommandInteraction;
    private playTrack: string = '';

    connection = joinVoiceChannel({
        channelId: this.userVoice,
        guildId: this.interaction.guildId as string,
        adapterCreator: this.interaction.guild?.voiceAdapterCreator as any,
    });
    player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    resource = createAudioResource(this.playTrack, { inlineVolume: true });

    setConnect(userVoice: string, interaction: ChatInputCommandInteraction): void {
        this.userVoice = userVoice;
        this.interaction = interaction;
    }
    setTrack(value: string): void {
        this.playTrack = value;
    }

}