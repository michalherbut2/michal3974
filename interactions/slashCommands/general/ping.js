const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Odpowiada Pong!"),
  
  async execute(interaction) {
    try {
      // Calculate the bot's ping and the message ping
      const botPing = interaction.client.ws.ping;
      const messagePing = Date.now() - interaction.createdTimestamp;

      // Create an embed message with the ping details
      const embed = {
        color: 0x0099ff,
        title: 'Pong!',
        fields: [
          {
            name: 'Opóźnienie bota',
            value: `${botPing} ms`,
          },
          {
            name: 'Opóźnienie względem wiadomości',
            value: `${messagePing} ms`,
          }
        ],
      };

      // Reply with the embed message
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Błąd podczas wykonywania komendy "ping":', error);
      // Handle the error and send an error message
      await interaction.reply({
        content: "Wystąpił błąd podczas sprawdzania opóźnienia!",
        ephemeral: true
      });
    }
  },
};