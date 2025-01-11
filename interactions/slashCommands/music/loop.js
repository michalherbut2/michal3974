const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Przełącza tryb pętli dla aktualnej piosenki"),
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
      if (!serverQueue.songs.length) {
        return await interaction.reply({
          content: "Nie ma aktualnie odtwarzanej piosenki!",
          ephemeral: true,
        });
      }

      // Toggle the looping status
      serverQueue.isLooping = !serverQueue.isLooping;
      const message = serverQueue.isLooping ? "Pętla jest włączona" : "Pętla jest wyłączona";

      // Send feedback to the user
      await interaction.reply(message);
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'loop':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas wykonywania komendy!",
        ephemeral: true,
      });
    }
  },
};