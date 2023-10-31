const { getVoiceConnections } = require("@discordjs/voice");
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, generateDependencyReport } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const { join } = require("node:path");


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
      const stream = ytdl(args[0], { filter: "audioonly" });
      client.player = createAudioPlayer();
      const voiceConnection=joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      // console.log(__dirname);
      const resource = createAudioResource(stream);
      // client.player.play(resource);
      // const subscription = voiceConnection.subscribe(client.player);

      // const resource = createAudioResource("/home/michal/Projekty/jura/michal3974/music/taczka.mp3");
      client.player.play(resource);
      client.player.on("error", error => {
        console.error(
          `Error: ${error.message} with resource ${error.resource.metadata.title}`
        );
        // player.play(getNextResource());
      });
      // Play "track.mp3" across two voice connections
      voiceConnection.subscribe(client.player);

      message.channel.send(`gra gitara 🎵`);
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error here, such as sending an error message to the channel
      message.channel.send(`Wystąpił błąd podczas odtwarzania muzyki.`);
    }
  },
};
