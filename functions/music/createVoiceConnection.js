const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = interaction => {

  const voiceChannel = interaction.member?.voice.channel;

  if (!voiceChannel)
    throw new Error("Dołącz do kanału głosowego!")

  const voiceConnection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
  
  return voiceConnection
}