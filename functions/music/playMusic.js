const sendEmbed = require("../messages/sendEmbed");

module.exports = async (interaction, audioResource, voiceConnection) => {
  try {
    // Fetch the server queue
    const serverQueue = await interaction.client.queue.get(interaction.guild.id);

    if (!serverQueue) {
      throw new Error("Server queue not found.");
    }

    // Set the channel and add the audio resource to the queue
    serverQueue.channel = interaction.channel;
    serverQueue.queue.push(...audioResource);

    // Subscribe to the voice connection and start playing if not already playing
    voiceConnection.subscribe(serverQueue.player);
    if (!serverQueue.isPlaying) serverQueue.play();

    // Extract metadata from the first audio resource
    const { title, duration } = audioResource[0].metadata;

    // Create the description for the embed
    const description = `gra gitara **${title}** - \`${duration}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;

    // Send the embed
    sendEmbed(interaction, { description });
  } catch (error) {
    console.error("Error processing the interaction:", error);

    // Notify the user about the error
    if (interaction.reply) {
      interaction.reply({
        content: `Błąd: ${error.message}`,
        ephemeral: true,
      }).catch(console.error);
    } else if (interaction.followUp) {
      interaction.followUp({
        content: `Błąd: ${error.message}`,
        ephemeral: true,
      }).catch(console.error);
    }
  }
};