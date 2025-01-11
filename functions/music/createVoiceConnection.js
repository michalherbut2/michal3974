const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = (interaction) => {
  try {
    // Get the voice channel the interaction member is in
    const voiceChannel = interaction.member?.voice.channel;

    // Check if the member is in a voice channel
    if (!voiceChannel) {
      throw new Error("Dołącz do kanału głosowego!");
    }

    // Join the voice channel
    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    return voiceConnection;
  } catch (error) {
    // Log the error
    console.error("Failed to join voice channel:", error);

    // Notify the interaction user about the error
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

    // Rethrow the error to be handled by the caller
    throw error;
  }
};