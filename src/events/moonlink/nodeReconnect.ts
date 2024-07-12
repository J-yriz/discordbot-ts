import App from "../../utils/discordBot";

const nodeCreate = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("nodeReconnect", (node) => {
        console.log(`${node.identifier} Menghubungkan ulang ke Lavalink!`);
    });
};

export default nodeCreate;
