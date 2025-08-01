const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('karaoke')
    .setDescription('Toggles the karaoke filter'),
  async execute(interaction) {
    const bot = interaction.client;
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "Obecnie nie gram w tej gildii.");

    if (!bot.utils.modifyQueue(interaction)) return;

    await queue.setFilters({
      karaoke: !queue.getFiltersEnabled().includes("karaoke")
    });

    return bot.say.successMessage(interaction, `${queue.getFiltersEnabled().includes("karaoke") ? "Zastosowano" : "Usunięto"} karaoke filter.`);
  }
};
