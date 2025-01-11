const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pomija jedną piosenkę"),
  async execute(interaction) {
    try {
      const serverQueue = interaction.client.queue.get(interaction.guild.id);

      // Check if there is an active server queue
      if (!serverQueue) {
        return await interaction.reply({
          content: "Nie ma aktywnej kolejki na tym serwerze!",
          ephemeral: true,
        });
      }

      // Check if there is a song currently playing
      if (!serverQueue.player) {
        return await interaction.reply({
          content: "Nie ma aktualnie odtwarzanej piosenki!",
          ephemeral: true,
        });
      }

      // Stop the current song
      serverQueue.player.stop();

      // Send feedback to the user
      await interaction.reply("Piosenka została pominięta. Dalej!");
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'skip':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas pomijania piosenki.",
        ephemeral: true,
      });
    }
  },
};