const { createSimpleEmbed } = require("./createEmbed");

module.exports = async (interaction, audioResource, voiceConnection) => {
  const serverQueue = await interaction.client.queue.get(interaction.guild.id);
  serverQueue.channel = interaction.channel;
  serverQueue.queue.push(audioResource);
  voiceConnection.subscribe(serverQueue.player);
  const {title, duration} = audioResource.metadata
  if (!serverQueue.isPlaying) 
    serverQueue.play()

  const content = `gra gitara **${title}** - \`${duration}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;

  interaction.reply({
    embeds: [createSimpleEmbed(content)],
  });
}