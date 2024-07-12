import "dotenv/config";

const config = {
    // Bot configuration
    Token: "" || process.env.DISCORD_TOKEN,
    ClientID: "" || process.env.DISCORD_CLIENT_ID,
    ClientSecret: "" || process.env.DISCORD_CLIENT_SECRET,

    // Genius API settings for lyrics [default: YouTube / Musixmatch]
    LyricsEngine: {
        // Recommended: Use Genius API for lyrics [BECAUSE IT'S BETTER]
        UseGenius: true, // Use Genius API for lyrics [NOTE: IF YOU SET THIS TO TRUE, YOU NEED TO PROVIDE GENIUS TOKEN BELOW]
        GeniusToken: "" || process.env.GENIUS_TOKEN, // Your Genius API Token
        ForceSearch: true, // Retry lyrics search on another engine if the first fails
    },

    // Lavalink configuration (https://lavalink.darrennathanael.com/)
    Lavalink: {
        LavaIP: "buses.sleepyinsomniac.eu.org" || process.env.LAVA_IP,
        LavaPort: 80 || process.env.LAVA_PORT,
        LavaPass: "youshallnotpass" || process.env.LAVA_PASS,
        Secure: false, // Set to true if using https or secure connection
        nodeName: "PetraMel-Node" || process.env.LAVA_NODE_NAME,
        autoPlay: false, // Bot plays music automatically when the queue is empty
    },
};

export default config;
