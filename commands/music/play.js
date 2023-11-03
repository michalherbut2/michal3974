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

  run: async (client, message, args) => {
    try {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return message.reply("dołącz do kanału głosowego!");

      // client.distube.play(voiceChannel, args.join(" "), {
      //   message,
      //   textChannel: message.channel,
      //   member: message.member,
      // });
      // const test = await ytsr(args.join(" "), { pages: 1 }).items[0].url;
      // console.log();
      const yt_info = await play.search(args.join(" "), {
        limit: 1,
      });

      const { url, title, durationRaw } = yt_info[0];

      const { stream } = await play.stream(url, {
        discordPlayerCompatibility: true,
      });

      client.queue.push(createAudioResource(stream));
      client.queue[client.queue.length - 1].title = title;
      client.queue[client.queue.length - 1].durationRaw = durationRaw;
      
      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      if (!client.isPlaying) {
        client.player = createAudioPlayer();
        client.player.play(client.queue[0]);
        client.isPlaying = true;
        client.player.on(AudioPlayerStatus.Idle, () => {
          client.queue.shift();
          client.queue.length
            ? client.player.play(client.queue[0])
            : (client.isPlaying = false);
          message.channel.send(`piosenki w kolejce: 🎵 ${client.queue.length}`);
        });
        client.player.on("error", error => {
          console.error(`Error: ${error.message} with resource ${error}`);
          client.queue.shift();
        });
        voiceConnection.subscribe(client.player);
      }
      message.channel.send(
        `gra gitara 🎵 piosenki w kolejce: ${client.queue.length}`
      );
    } catch (error) {
      console.error("Problem:", error);
      message.channel.send(`Wystąpił błąd podczas odtwarzania muzyki.`);
    }
  },
};
