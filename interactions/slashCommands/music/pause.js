const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../../functions/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Stopuje piosenkę"),

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

      // Pause the player
      serverQueue.player.pause();

      // Send feedback to the user
      await sendEmbed(interaction, { description: `halt 🎵` });
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'pause':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas wykonywania komendy!",
        ephemeral: true,
      });
    }
  },
};