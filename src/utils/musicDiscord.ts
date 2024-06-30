import {
    AudioPlayerStatus,
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioResource,
} from "@discordjs/voice";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { IQueue } from "./interface";
import fs from "fs";

export const queue: IQueue[] = [];

export const connection = (userVoice: string, interaction: ChatInputCommandInteraction) => {
    return joinVoiceChannel({
        channelId: userVoice,
        guildId: interaction.guildId as string,
        adapterCreator: interaction.guild?.voiceAdapterCreator as any,
    });
};

const player = () => {
    return createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });
};

export const resource = (track: string) => {
    return createAudioResource(track);
};

export const setQueue = (track: IQueue, interaction: ChatInputCommandInteraction) => {
    queue.push(track);
    fs.writeFileSync(
        `./json/guilds/${interaction.guildId}.json`,
        JSON.stringify({ serverName: interaction.guild?.name, queueMusic: queue }, null, 2)
    );
};

export const skipMusic = (interaction: ChatInputCommandInteraction) => {
    queue.shift();
    fs.writeFileSync(
        `./json/guilds/${interaction.guildId}.json`,
        JSON.stringify({ serverName: interaction.guild?.name, queueMusic: queue }, null, 2)
    );
}

export const clearQueue = (interaction: ChatInputCommandInteraction) => {
    queue.splice(0, queue.length);
    fs.writeFileSync(
        `./json/guilds/${interaction.guildId}.json`,
        JSON.stringify({ serverName: interaction.guild?.name, queueMusic: queue }, null, 2)
    );
}

// Embed
export const noVoiceChannel: EmbedBuilder = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("Kamu harus berada di voice channel untuk menggunakan perintah ini")
    .setColor("DarkRed");

export const playerBot = player();