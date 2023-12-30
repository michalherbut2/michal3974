module.exports = {
  name: "8d",
  description: "Użyj 8d",
  category: "filters",
  async execute(bot, interaction) {
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "Panie ja nic nie gram");

    if (!bot.utils.modifyQueue(interaction)) return;

    await queue.setFilters({
      "8D": !queue.getFiltersEnabled().includes("8D")
    });

    return bot.say.successMessage(interaction, `${queue.getFiltersEnabled().includes("8D") ? "Odpalono" : "Wywalono"} 8d.`);
  }
};
