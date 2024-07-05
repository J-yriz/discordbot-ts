import { ButtonInteraction } from "discord.js";

const nextSearch = {
    customId: "nextSearch",
    async exec (interaction: ButtonInteraction) {
        await interaction.reply({
            content: "Next search",
        });
    },
};

export default nextSearch;