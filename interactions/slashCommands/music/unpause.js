const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../../functions/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unpause")
    .setDescription("Odpauzowuje muzykę"),

  async execute(interaction) {
    try {
      const { client, guild } = interaction;

      // Ensure the guild exists
      if (!guild) {
        return await sendEmbed(interaction, {
          description: "Nie znaleziono serwera!",
          ephemeral: true,
        });
      }

      const serverQueue = client.queue.get(guild.id);

      // Check if there is an active server queue
      if (!serverQueue) {
        return await interaction.reply({
          content: "Nie ma aktywnej kolejki na tym serwerze!",
          ephemeral: true,
        });
      }

      // Check if there is a player currently paused
      if (!serverQueue.player) {
        return await interaction.reply({
          content: "Nie ma aktualnie odtwarzanej muzyki!",
          ephemeral: true,
        });
      }

      // Unpause the player
      serverQueue.player.unpause();

      // Send a success message
      await sendEmbed(interaction, { description: `Jazda 🎵` });
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'unpause':", error);
      await sendEmbed(interaction, {
        description: "Wystąpił błąd podczas odpauzowania muzyki.",
        ephemeral: true,
      });
    }
  },
};