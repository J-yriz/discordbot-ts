import WebSocket from "ws";
import axios from "axios";
import config, { lavalink } from "../config";
const {
    ClientID,
    Lavalink: { LavaPass },
} = config;
const ws = new WebSocket(`${lavalink("ws")}`, {
    headers: {
        Authorization: LavaPass,
        "User-Id": ClientID,
        "Client-Name": "LavaClient",
    },
});

ws.on("open", () => {
    console.log("Connected to Lavalink server");
});

ws.on("error", (error) => {
    console.error("WebSocket error:", error);
});

ws.on("close", () => {
    console.log("Disconnected from Lavalink server");
});

interface ITrack {
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
    }
}

async function searchTrack(query: string = "") {
    if (!query) {
        console.log("Please provide a query to search || Track Not Found");
        return
    }
    if (query.includes('http' || 'https')) {
        console.log("easy there, don't put the link in the query || Track Not Found");
        return
    }
    const response = await axios.get(`${lavalink("http")}/v3/loadtracks`, {
        headers: {
            Authorization: LavaPass,
        },
        params: {
            identifier: `ytsearch: ${query}`,
        },
    });
    response.data.tracks.forEach((track: ITrack) => {
        console.log(track.info.title);
    });
}

searchTrack("https://www.youtube.com/watch?v=e-Ppg6666ww");
