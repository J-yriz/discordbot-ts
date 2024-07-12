import App from "../../utils/discordBot";

const nodeClose = (app: App, token: string, commands: any[]) => {
    app.lavaClient?.on("nodeClose", (node) => {
        console.log(`${node.identifier} telah ditutup!`);
    });
};

export default nodeClose;
