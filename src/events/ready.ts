import { Events } from "discord.js";

const ready = (app: any, token: string, commands: any[]): void => {
    app.once(Events.ClientReady, (app: any) => {
        console.log(`Logged in as ${app.user.tag}`);
    });
};

export default ready;