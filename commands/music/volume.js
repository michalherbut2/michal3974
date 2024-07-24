const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Ustaw głośność')
    .addIntegerOption(option => 
      option.setName('poziom')
        .setDescription('Wybierz poziom głośności')
        .setRequired(true)
        .addChoice('0%', 0)
        .addChoice('25%', 25)
        .addChoice('50%', 50)
        .addChoice('75%', 75)
        .addChoice('100%', 100)
        .addChoice('125%', 125)
        .addChoice('150%', 150)
        .addChoice('175%', 175)
        .addChoice('200%', 200)
    ),
  async execute(interaction) {
    const bot = interaction.client;
    const volumeLevel = interaction.options.getInteger('poziom');

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "Aktualnie nie odtwarzam muzyki na tym serwerze.");

    if (!bot.utils.modifyQueue(interaction)) return;

    await queue.setVolume(volumeLevel);

    return bot.say.successMessage(interaction, `Ustawiono głośność na ${volumeLevel}%.`);
  }
};
