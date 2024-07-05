import "dotenv/config";

const config = {
    // Your bot's
    Token: "" || process.env.DISCORD_TOKEN,
    ClientID: "" || process.env.DISCORD_CLIENT_ID,
    ClientSecret: "" || process.env.DISCORD_CLIENT_SECRET,
    // Genius API Token from https://docs.genius.com/
    GeniusToken: "" || process.env.GENIUS_TOKEN,
    // You can get this from https://lavalink.darrennathanael.com/
    Lavalink: {
        // Type link but without http:// or https:// and ws:// or wss://
        LavaIP: "lava-v3.ajieblogs.eu.org" || process.env.LAVA_IP,
        LavaPort: 443 || process.env.LAVA_PORT,
        LavaPass: "https://dsc.gg/ajidevserver" || process.env.LAVA_PASS,
        Secure: true, // If you're using https, set this to true
    },
};

// Please don't touch this
export function lavalink(): string {
    const { LavaIP, LavaPort, Secure } = config.Lavalink;

    if ( !LavaIP || !LavaPort || !Secure ) throw new Error("Please fill the Lavalink config");

    if (Secure) {
        return `https://${LavaIP}:${LavaPort}`;
    } else {
        return `http://${LavaIP}:${LavaPort}`;
    }
}

export default config;
