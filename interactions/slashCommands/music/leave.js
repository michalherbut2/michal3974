const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { createWarningEmbed } = require("../../../functions/messages/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nara")
    .setDescription("Udaję się na spoczynek, Sir!"),
  async execute(interaction) {
    try {
      const serverQueue = interaction.client.queue.get(interaction.guild.id);

      if (!serverQueue) {
        return await interaction.reply({
          embeds: [createWarningEmbed("Nie ma aktywnej kolejki na tym serwerze!")],
          ephemeral: true,
        });
      }

      // Clear the queue and stop the player
      serverQueue.queue = [];
      if (serverQueue.player) {
        serverQueue.player.stop();
      }

      const connection = getVoiceConnection(interaction.guild.id);
      if (!connection) {
        return await interaction.reply({
          embeds: [createWarningEmbed("Bot już udał się na spoczynek, Sir!")],
          ephemeral: true,
        });
      }

      connection.destroy();

      await interaction.reply("Udaję się na spoczynek, Sir!");
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'nara':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas wykonywania komendy!",
        ephemeral: true,
      });
    }
  },
};