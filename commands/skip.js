module.exports = {
  config: {
    name: "skip",
    description: "skip song",
    usage: `skip`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    client.player.stop()
    message.channel.send(`koniec 🎵`);
  },
};
