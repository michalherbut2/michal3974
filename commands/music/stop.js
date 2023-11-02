module.exports = {
  config: {
    name: "stop",
    description: "stop song",
    usage: `stop`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    client.distube.stop(message);
    message.channel.send(`koniec 🎵`);
  },
};
