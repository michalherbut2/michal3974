const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Odpowiada Pong!"),
  
  async execute(interaction) {
    try {
      const botPing = interaction.client.ws.ping;
      const messagePing = Date.now() - interaction.createdTimestamp;

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

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Błąd podczas wykonywania komendy "ping":', error);
      // Handle the error, send an error message, or take appropriate action
      await interaction.reply("Wystąpił błąd podczas sprawdzania opóźnienia!");
    }
  },
};