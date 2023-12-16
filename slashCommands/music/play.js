const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const getResource = require("../../computings/getResource");

class Queue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.leftChannel = false;
    this.timeout = null;
  }
}

class QueueManager {
  constructor() {
    this.queues = new Map();
  }

  getQueue(serverId) {
    if (!this.queues.has(serverId)) {
      this.queues.set(serverId, new Queue());
    }
    return this.queues.get(serverId);
  }

  setQueue(serverId, queue) {
    this.queues.set(serverId, queue);
  }

  deleteQueue(serverId) {
    this.queues.delete(serverId);
  }
}

const queueManager = new QueueManager();

module.exports = {
  data: {
    name: "play",
    description: "Gra piosenkę z yt",
    options: [
      {
        name: "muzyka",
        description: "nazwa piosenki lub link yt",
        type: "STRING",
        required: true,
      },
    ],
  },

  async execute(interaction) {
    try {
      const voiceChannel = interaction.member.voice.channel;
      const song = interaction.options.getString("muzyka");
      const serverId = interaction.guild.id;

      if (!voiceChannel)
        return interaction.reply({
          embeds: [createWarningEmbed("dołącz do kanału głosowego!")],
          ephemeral: true,
        });

      const serverQueue = queueManager.getQueue(serverId);
      const resource = await getResource(song);
      const { title, duration } = resource.metadata;

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: serverId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        audioEncoderCreator: {
          createOpusEncoder: () => ({ opusEncode: /* Your Opus encoding function */ }),
        },
      });

      serverQueue.channel = interaction.channel;
      serverQueue.queue.push(resource);

      if (!serverQueue.isPlaying) {
        serverQueue.player.play(serverQueue.queue[0]);
        serverQueue.isPlaying = true;
      }

      voiceConnection.subscribe(serverQueue.player);

      serverQueue.leftChannel = false;

      const content = `gra gitara **${title}** - \`${duration}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;
      interaction.reply({
        embeds: [createSimpleEmbed(content)],
      });

      const timeout = setTimeout(() => {
        voiceConnection.destroy();
        serverQueue.leftChannel = true;
        queueManager.deleteQueue(serverId);
      }, 5 * 60 * 1000); // 5 minutes

      serverQueue.timeout = timeout;
    } catch (error) {
      console.error("Problem:", error);
      interaction.reply({
        embeds: [
          createWarningEmbed(`Wystąpił błąd podczas odtwarzania muzyki.`),
        ],
      });
    }
  },
};
