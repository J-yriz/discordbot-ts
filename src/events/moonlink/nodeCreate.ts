import App from "../../utils/discordBot";

const nodeCreate = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("nodeCreate", (node) => {
        console.log(`${node.identifier} Sudah terhubung ke Lavalink!`);
    });
};

export default nodeCreate;
