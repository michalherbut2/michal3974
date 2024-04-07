module.exports = {
  data: {
    name: 'pause'
  },
  async execute(interaction) {
    interaction.client.queue.get(interaction.guild.id).player.pause();
    await interaction.reply({ content: `halt 🎵`, ephemeral: true });
  },
};