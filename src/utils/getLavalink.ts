import WebSocket from "ws";
import config, { lavalink } from "../config";
const { ClientID, Lavalink: { LavaPass } } = config
const ws = new WebSocket(lavalink(), {
    headers: {
        Authorization: LavaPass,
        "Num-Shards": "1",
        "User-Id": ClientID,
    },
});

ws.on("open", () => {
    console.log("Connected to Lavalink server");
});

ws.on("message", (data: string) => {
    const message = JSON.parse(data);
    console.log("Received message:", message);
});

ws.on("error", (error) => {
    console.error("WebSocket error:", error);
});

ws.on("close", () => {
    console.log("Disconnected from Lavalink server");
});
