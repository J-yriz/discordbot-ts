import { ButtonInteraction } from "discord.js";

const prevSearch = {
    customId: "prevSearch",
    async exec (interaction: ButtonInteraction) {
        await interaction.reply({
            content: "Prev search",
        });
    },
};

export default prevSearch;