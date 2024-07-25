# Discord Bot in TypeScript

This project is a Discord bot built using TypeScript and the [discord.js](https://discord.js.org/#/) library, version 14.15.3.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/J-yriz/discordbot-ts.git
    cd discordbot-ts
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Discord bot token:

    ```env
    DISCORD_TOKEN=YOUR_TOKEN
    DISCORD_CLIENT_ID=YOUR_CLIENT_ID
    DISCORD_CLIENT_SECRET=YOUR_CLIENT_SECRET
    <!-- Optional if ur config.ts UseGenius false -->
    GENIUS_TOKEN=YOUR_GENIUS_TOKEN
    LAVA_IP="127.0.0.1"
    LAVA_PORT=3000
    LAVA_PASS="NOTYOURBUSINESS"
    ```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript.
- `npm run start` - Start the bot using the compiled JavaScript code.

## Project Structure

- `src/` - The main source code for the bot.
- `dist/` - The compiled JavaScript code.

