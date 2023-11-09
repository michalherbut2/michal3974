const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: {
    name: 'unpause'
  },
  async execute(interaction) {
    interaction.client.queue.get(interaction.guild.id).player.unpause();
    await interaction.reply(`jazda 🎵`);
  },
};