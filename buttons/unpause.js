module.exports = {
  data: {
    name: 'unpause'
  },
  async execute(interaction) {
    interaction.client.queue.get(interaction.guild.id).player.unpause();
    await interaction.reply({ content: `jazda 🎵`, ephemeral: true });
  },
};