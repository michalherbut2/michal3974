module.exports = {
  name: "karaoke",
  description: "Toggles the karaoke filter.",
  category: "filters",
  async execute(bot, interaction) {
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "Obecnie nie gram w tej gildii.");

    if (!bot.utils.modifyQueue(interaction)) return;

    await queue.setFilters({
      kakaoke: !queue.getFiltersEnabled().includes("karaoke")
    });

    return bot.say.successMessage(interaction, `${queue.getFiltersEnabled().includes("karaoke") ? "Zastosowano" : "Usunięto"} karaoke filter.`);
  }
};
