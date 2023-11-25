const { joinVoiceChannel, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");
const {
  createSimpleEmbed,
  createWarningEmbed,
} = require("../../computings/createEmbed");

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
    try {
      const voiceChannel = message.member.voice.channel;
      const serverId = message.guild.id;
      if (!voiceChannel)
        return message.reply({
          embeds: [createWarningEmbed("dołącz do kanału głosowego!")],
        });

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

      const serverQueue = client.queue.get(serverId);
      serverQueue.channel = message.channel;
      serverQueue.queue.push(resource);

      if (!serverQueue.isPlaying) {
        serverQueue.player.play(serverQueue.queue[0]);
        serverQueue.isPlaying = true;
      }

      voiceConnection.subscribe(serverQueue.player);

      const content = `gra gitara **${title}** - \`${durationRaw}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;
      message.channel.send({
        embeds: [createSimpleEmbed(content)],
      });
    } catch (error) {
      console.error("Problem:", error);
      message.channel.send({
        embeds: [
          createWarningEmbed(`Wystąpił błąd podczas odtwarzania muzyki.`),
        ],
      });
    }
  },
};
