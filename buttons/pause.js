const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: {
    name: 'pause'
  },
  async execute(interaction) {
    interaction.client.queue.get(interaction.guild.id).player.pause();
    await interaction.reply(`halt 🎵`);
  },
};