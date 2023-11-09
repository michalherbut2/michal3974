const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: {
    name: 'skip'
  },
  async execute(interaction) {
    interaction.client.queue.get(interaction.guild.id).player.stop();
    await interaction.reply(`dalej 🎵`);
  },
};