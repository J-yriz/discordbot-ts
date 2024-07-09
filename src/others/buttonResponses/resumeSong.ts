import { ChatInputCommandInteraction } from "discord.js";
import App from "../../utils/discordBot";
import resume from "../../commands/music/resume";

const resumeSong = {
    customId: "resume",
    async exec(interaction: ChatInputCommandInteraction, app: App) {
        resume.exec(interaction, app);
    },
}

export default resumeSong;