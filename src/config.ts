import 'dotenv/config'

const config = {
    Token: '' || process.env.DISCORD_TOKEN,
    ClientID: '' || process.env.DISCORD_CLIENT_ID,
    ClientSecret: '' || process.env.DISCORD_CLIENT_SECRET,
}

export default config;