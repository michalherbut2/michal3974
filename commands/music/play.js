module.exports = {
  config: {
    name: "graj",
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
      
      client.distube.play(voiceChannel, args.join(" "), {
        message,
        textChannel: message.channel,
        member: message.member,
      });

      // message.channel.send(`gra gitara 🎵 ${name.videoDetails.title}`);
    } catch (error) {
      console.error('Problem:', error);
      // Handle the error here, such as sending an error message to the channel
      message.channel.send(`Wystąpił błąd podczas odtwarzania muzyki.`);
    }
  },
};
