const sendEmbed = require("../messages/sendEmbed");

module.exports = async (interaction, audioResource, voiceConnection) => {
  const serverQueue = await interaction.client.queue.get(interaction.guild.id);
  serverQueue.channel = interaction.channel;
  serverQueue.queue.push(...audioResource);
  // serverQueue.queue.push(audioResource);
  voiceConnection.subscribe(serverQueue.player);
  if (!serverQueue.isPlaying) serverQueue.play();
  const { title, duration } = audioResource[0].metadata;
  // const { title, duration } = audioResource.metadata;

  const description = `gra gitara **${title}** - \`${duration}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;

  sendEmbed(interaction, { description });
};
