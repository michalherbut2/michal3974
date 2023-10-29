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
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("dołącz do kanału głosowego!");
    const stream = ytdl(args[0], { filter: "audioonly" });
    client.player = createAudioPlayer();
    const voiceConnection=joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    console.log(__dirname);
    let resource = createAudioResource(stream);
    client.player.play(resource);
    const subscription = voiceConnection.subscribe(client.player);
    message.channel.send(`gra gitara 🎵`);
  },
};
