import App from "../../utils/discordBot";

const nodeCreate = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("nodeError", (node, error) => {
        console.log(`Error on ${node.identifier}: ${error}`);
    });
};

export default nodeCreate;
