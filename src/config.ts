import 'dotenv/config'

const config = {
    Token: '' || process.env.DISCORD_TOKEN,
    ClientID: '' || process.env.DISCORD_CLIENT_ID,
    ClientSecret: '' || process.env.DISCORD_CLIENT_SECRET,
    Lavalink: {
        LavaIP: 'localhost' || process.env.LAVA_IP,
        LavaPort: '2333' || process.env.LAVA_PORT,
        LavaPass: 'testingajah' || process.env.LAVA_PASS,
        Secure: true
    }
}

export function lavalink(x: string): string {
    if (x === 'http' || 'https') return `${x}://${config.Lavalink.LavaIP}:${config.Lavalink.LavaPort}`;
    return `${x}://${config.Lavalink.LavaIP}:${config.Lavalink.LavaPort}`;
}

export default config;