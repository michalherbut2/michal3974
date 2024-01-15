const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bassboost')
    .setDescription('Ustaw bassboost')
    .addStringOption(option => 
      option.setName('poziom')
        .setDescription('Wybierz moc bass')
        .setRequired(true)
        .addChoice('Niski', 'low')
        .addChoice('Średni', 'medium')
        .addChoice('Wysoki', 'high')
        .addChoice('Bomba', 'earrape')
        .addChoice('OFF', 'off')
    ),
  async execute(interaction) {
    const bot = interaction.client;
    const level = interaction.options.getString('poziom');

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "Aktualnie nie odtwarzam muzyki na tym serwerze.");

    if (!bot.utils.modifyQueue(interaction)) return;

    let filterName;
    switch (level) {
      case "low":
        filterName = "bassboost_low";
        await queue.setFilters({
          bassboost_low: true
        });
        break;

      case "medium":
        filterName = "bassboost";
        await queue.setFilters({
          bassboost: true
        });
        break;

      case "high":
        filterName = "bassboost_high";
        await queue.setFilters({
          bassboost_high: true
        });
        break;

      case "earrape":
        filterName = "earrape";
        await queue.setFilters({
          earrape: true
        });
        break;

      case "off":
        filterName = "none";
        await queue.setFilters({
          bassboost_low: false,
          bassboost: false,
          bassboost_high: false,
          earrape: false
        });
        break;
    }

    return bot.say.successMessage(interaction, `${queue.getFiltersEnabled().includes(`${filterName}`) ? `Moc bassbost to \`${level}\`` : "Wyłączono bassboost"}.`);
  }
};
