import "dotenv/config";

const config = {
    Token: "" || process.env.DISCORD_TOKEN,
    ClientID: "" || process.env.DISCORD_CLIENT_ID,
    ClientSecret: "" || process.env.DISCORD_CLIENT_SECRET,
    Lavalink: {
        LavaIP: "lava-v3.ajieblogs.eu.org" || process.env.LAVA_IP,
        LavaPort: 443 || process.env.LAVA_PORT,
        LavaPass: "https://dsc.gg/ajidevserver" || process.env.LAVA_PASS,
        Secure: true,
    },
};

export function lavalink(x: string): string {
    const { LavaIP, LavaPort, Secure } = config.Lavalink;

    if (x === "http" && Secure) {
        return `https://${LavaIP}:${LavaPort}`;
    } else if (x === "http" && !Secure){
        return `http://${LavaIP}:${LavaPort}`;
    }

    if (x === "ws" && Secure) {
        return `wss://${LavaIP}:${LavaPort}`;
    } else if (x === "ws" && !Secure){
        return `ws://${LavaIP}:${LavaPort}`;
    }

    return 'error'
}

export default config;
