const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Kończy granie muzyki!"),
  
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

      // Check if there is a player currently playing
      if (!serverQueue.player) {
        return await interaction.reply({
          content: "Nie ma aktualnie odtwarzanej muzyki!",
          ephemeral: true,
        });
      }

      // Clear the queue and stop the player
      serverQueue.queue = [];
      serverQueue.player.stop();

      await interaction.reply("Skończył się dzień dziecka!");
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'stop':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas zatrzymywania muzyki.",
        ephemeral: true,
      });
    }
  },
};