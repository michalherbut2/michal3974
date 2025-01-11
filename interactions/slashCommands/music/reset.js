const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../../functions/messages/sendEmbed");
const ServerQueue = require("../../../models/ServerQueue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Resetuje muzykę jak coś nie prądzi"),

  async execute(interaction) {
    try {
      const { client, guild } = interaction;

      // Check if the guild exists
      if (!guild) {
        return await sendEmbed(interaction, {
          description: "Nie znaleziono serwera!",
          ephemeral: true,
        });
      }

      // Reset the server queue
      client.queue.set(guild.id, new ServerQueue());

      // Send a success message
      await sendEmbed(interaction, { description: `Reset bota 🎵` });
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'reset':", error);
      await sendEmbed(interaction, {
        description: "Wystąpił błąd podczas resetowania muzyki.",
        ephemeral: true,
      });
    }
  },
};