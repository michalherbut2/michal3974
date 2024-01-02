module.exports = {
  name: "volume",
  description: "Ustaw głośność",
  category: "filters",
  usage: "<poziom>",
  options: [
    {
      name: "poziom",
      description: "Wybierz poziom głośności",
      type: "INTEGER",
      required: true,
      choices: [
        { name: "0%", value: 0 },
        { name: "25%", value: 25 },
        { name: "50%", value: 50 },
        { name: "75%", value: 75 },
        { name: "100%", value: 100 },
        { name: "125%", value: 125 },
        { name: "150%", value: 150 },
        { name: "175%", value: 175 },
        { name: "200%", value: 200 }
      ],
    },
  ],
  async execute(bot, interaction) {
    const volumeLevel = await interaction.options.getInteger("poziom", true);

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "Aktualnie nie odtwarzam muzyki na tym serwerze.");

    if (!bot.utils.modifyQueue(interaction)) return;

    await queue.setVolume(volumeLevel);

    return bot.say.successMessage(interaction, `Ustawiono głośność na ${volumeLevel}%.`);
  }
};
