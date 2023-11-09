const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const play = require("play-dl");

module.exports = {
  config: {
    name: "play",
    description: "play yt",
    usage: `play`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
//seohost
  run: async (client, message, args) => {
    console.log("elo");
    try {
      const voiceChannel = message.member.voice.channel;
      const serverId = message.guild.id;
      if (!voiceChannel) return message.reply("dołącz do kanału głosowego!");

      const yt_info = await play.search(args.join(" "), {
        limit: 1,
      });

      const { url, title, durationRaw } = yt_info[0];

      const { stream } = await play.stream(url, {
        discordPlayerCompatibility: true,
      });

      const resource = createAudioResource(stream);
      resource.metadata = {
        title,
        duration: durationRaw,
      };

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: serverId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      console.log("elo");
      const serverQueue =
        client.queue.get(serverId) || {
          queue: [],
          isPlaying: false,
          player: null,
        }
      client.queue.set(serverId, serverQueue);

      serverQueue.queue.push(resource);

      if (!serverQueue.isPlaying) {
        // client.player = createAudioPlayer();
        serverQueue.player = createAudioPlayer();

        // client.player.on(AudioPlayerStatus.Idle, () => {
        serverQueue.player.on(AudioPlayerStatus.Idle, () => {
          // client.queue.shift();
          serverQueue.queue.shift();
          serverQueue.queue.length
            ? serverQueue.player.play(serverQueue.queue[0])
            : (serverQueue.isPlaying = false);
          message.channel.send(
            `piosenki w kolejce: 🎵 ${serverQueue.queue.length}`
          );
        });

        serverQueue.player.on("error", error => {
          console.error(`Error: ${error.message} with resource ${error}`);
          serverQueue.queue.shift();
        });
        // client.player.play(client.queue[0]);
        serverQueue.player.play(serverQueue.queue[0])
        
        voiceConnection.subscribe(serverQueue.player);
        
        // client.isPlaying = true;
        serverQueue.isPlaying = true;
      }
      message.channel.send(
        `gra gitara 🎵 piosenki w kolejce: ${serverQueue.queue.length}`
      );
    } catch (error) {
      console.error("Problem:", error);
      message.channel.send(`Wystąpił błąd podczas odtwarzania muzyki.`);
    }
  },
};
