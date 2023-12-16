const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { QueueManager } = require("./QueueManager");

const queueManager = new QueueManager();

module.exports = {
  data: {
    name: "rejoin",
    description: "Przywróć bota do kanału głosowego.",
  },

  async execute(interaction) {
    try {
      const serverId = interaction.guild.id;
      const serverQueue = queueManager.getQueue(serverId);

      if (serverQueue && serverQueue.timeout && !serverQueue.leftChannel) {
        clearTimeout(serverQueue.timeout);

        const voiceChannel = interaction.member.voice.channel;
        const voiceConnection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: serverId,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          audioEncoderCreator: {
            createOpusEncoder: () => ({ opusEncode: /* Your Opus encoding function */ }),
          },
        });
        voiceConnection.subscribe(serverQueue.player);

        interaction.reply({
          content: "Bot został przywrócony do kanału głosowego.",
        });
      } else {
        if (serverQueue) {
          serverQueue.leftChannel = false;
        }

        interaction.reply({
          content: "Bot nie opuścił kanału głosowego w ciągu ostatnich 5 minut.",
        });
      }
    } catch (error) {
      console.error("Problem:", error);
      interaction.reply({
        content: "Wystąpił błąd podczas przywracania bota do kanału głosowego.",
      });
    }
  },
};
