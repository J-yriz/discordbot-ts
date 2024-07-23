import "dotenv/config";

const config = {
    // Bot configuration
    Token: "" || process.env.DISCORD_TOKEN,
    ClientID: "" || process.env.DISCORD_CLIENT_ID,
    ClientSecret: "" || process.env.DISCORD_CLIENT_SECRET,

    Presence: {
        Activity: {
            Name: "Dakwah", // Activity name
            Type: "LISTENING",    // PLAYING, WATCHING, LISTENING, STREAMING
        },
        Status: "Idle", // Online, Idle, DoNotDisturb, Invisible
    },

    // Genius API settings for lyrics [default: YouTube / Musixmatch]
    LyricsEngine: {
        // Recommended: Use Genius API for lyrics [BECAUSE IT'S BETTER]
        UseGenius: true, // Use Genius API for lyrics [NOTE: IF YOU SET THIS TO TRUE, YOU NEED TO PROVIDE GENIUS TOKEN BELOW]
        GeniusToken: "" || process.env.GENIUS_TOKEN, // Your Genius API Token
        ForceSearch: true, // Retry lyrics search on another engine if the first fails
    },

    // Lavalink configuration (https://lavalink.darrennathanael.com/)
    Lavalink: {
        LavaIP: "" || process.env.LAVA_IP,
        LavaPort: 0 || process.env.LAVA_PORT,
        LavaPass: "" || process.env.LAVA_PASS,
        Secure: false, // Set to true if using https or secure connection
        nodeName: "Petra-Node", // Lavalink node name
        autoPlay: false, // Bot plays music automatically when the queue is empty
    },
};

export default config;
