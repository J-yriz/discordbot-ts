import config from "./config";
import App from "./lib/discordBot";

const Bot = new App();

try {
    Bot.start(config.Token);
} catch (error) {
    console.error(error);
}