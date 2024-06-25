import config from "./config";
import App from "./utils/discordBot";

const Bot = new App();

try {
    Bot.start(config.Token);
} catch (error) {
    console.error(error);
}

// import { searchTrack } from "./utils/getLavalink";
// searchTrack('Rex Orange County - Sunflower')
//     .then((data) => {
//         console.log(data);
//     })