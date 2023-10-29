const ytdl = require('ytdl-core');

// client.on('message', message => {
//   if (message.content.startsWith('!play')) {
//     const voiceChannel = message.member.voice.channel;
//     if (!voiceChannel) return message.reply('dołącz do kanału głosowego!');
//     const stream = ytdl(message.content.split(' ')[1], { filter: 'audioonly' });
//     voiceChannel.join().then(connection => {
//       const dispatcher = connection.play(stream);
//       dispatcher.on('finish', () => voiceChannel.leave());
//     });
//   }
// });

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
    console.log(voiceChannel);
    voiceChannel.join().then(connection => {
      const dispatcher = connection.play(stream);
      dispatcher.on("finish", () => voiceChannel.leave());
    });
    message.channel.send(`muzyka 🎵`);
  },
};
