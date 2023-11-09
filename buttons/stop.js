const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: {
    name: 'stop'
  },
  async execute(interaction) {
    interaction.client.queue.get(interaction.guild.id).queue = [];
    interaction.client.queue.get(interaction.guild.id).player.stop();
    await interaction.reply({ content: `stop 🎵`, ephemeral: true });
  },
};