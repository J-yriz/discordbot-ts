import App from "../../utils/discordBot";
import axios from "axios";
import WebSocket from "ws";
import { join } from "path";
import config from "../../config";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } from "@discordjs/voice";

interface IDataResponse {
    data: {
        loadType: string;
        tracks: [
            {
                encode: string;
                track: string;
                info: {
                    identifier: string;
                    isSeekable: boolean;
                    author: string;
                    length: number;
                    isStream: boolean;
                    position: number;
                    title: string;
                    uri: string;
                    sourceName: string;
                };
            }
        ];
    };
}

const ws = new WebSocket("ws://localhost:2333", {
    headers: {
        Authorization: "testingajah",
        "User-Id": config.ClientID,
        "Client-Name": "Lavalink-Jariz",
    },
});

ws.on("message", (data: string) => {
    const message = JSON.parse(data);
    console.log(message);

    if (message.op === "playerUpdate") {
        if (!message.state.connected) {
            console.log("Lavalink reported not connected:", message);
        } else {
            console.log("Lavalink reported connected:", message);
        }
    }
});

ws.on("error", (error) => {
    console.error("WebSocket error:", error);
});

ws.on("close", () => {
    console.log("Disconnected from Lavalink server");
});

async function searchTrack(query: string = ""): Promise<[string]> {
    try {
        const response: IDataResponse = await axios.get(`http://localhost:2333/loadtracks`, {
            headers: {
                Authorization: "testingajah",
                "Content-Type": "application/json",
            },
            params: {
                identifier: `ytsearch: ${query}`,
            },
        });

        console.log(response.data.tracks[0].info.uri);
        return [response.data.tracks[0].track];
    } catch (error) {
        return [`Error searching track: ${error}`];
    }
}

function playTrack(guildId: string, track: string) {
    const payload = {
        op: "play",
        guildId: guildId,
        track: track,
    };
    ws.send(JSON.stringify(payload));
}

const play = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .addStringOption((option) => option.setName("song").setDescription("The song you want to play").setRequired(true)),
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        const query: string = interaction.options.getString("song") as string;
        const guild = interaction.guild?.members.cache.get(interaction.user.id);
        const userVoice = guild?.voice.channel?.id;
        if (!userVoice) {
            return await interaction.reply({ content: "You need to join a voice channel first!", ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: userVoice,
            guildId: interaction.guildId as string,
            adapterCreator: interaction.guild?.voiceAdapterCreator as any,
        });

        const data = await searchTrack(query);

        playTrack(interaction.guildId as string, data[0]);

        const player = createAudioPlayer();
        const trackUrl = `http://localhost:2333/track/${data[0]}`;
        const resource = createAudioResource(trackUrl);
        player.play(resource);
        connection.subscribe(player);

        player.on("error", (error) => {
            console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Player is idle");
        });

        app.on("voiceStateUpdate", (oldState, newState) => {
            if (newState.id === app.user?.id && newState.channelId) {
                const voiceServerUpdatePayload = {
                    op: "voiceUpdate",
                    guildId: newState.guild.id,
                    event: newState.guild.voiceAdapterCreator,
                    sessionId: newState.sessionId,
                };

                console.log("Sending voice server update payload:", voiceServerUpdatePayload);
                ws.send(JSON.stringify(voiceServerUpdatePayload));
            }
        });
    },
};

export default play;
