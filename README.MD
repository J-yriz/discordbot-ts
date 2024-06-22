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
    cd your-repo-name
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Discord bot token:

    ```env
    DISCORD_TOKEN=YOUR TOKEN
    DISCORD_CLIENT_ID=YOUR CLIENT ID
    DISCORD_CLIENT_SECRET=YOUR CLIENT SECRET
    ```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript.
- `npm run start` - Start the bot using the compiled JavaScript code.
- `npm run dev` - Start the bot using ts-node for development.

## Project Structure

- `src/` - The main source code for the bot.
- `compile/` - The compiled JavaScript code.

