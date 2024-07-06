import config from "./config";
import App from "./utils/discordBot";

const Bot: App = new App();

try {
    Bot.start(config.Token);
} catch (error) {
    console.error(error);
}
