module.exports = {
  config: {
    name: "unpause",
    description: "skip song",
    usage: `unpause`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    client.distube.resume(message);
    message.channel.send(`jazda 🎵`);
  },
};
