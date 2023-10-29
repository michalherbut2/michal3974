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
    client.player.unpause();
    message.channel.send(`jazda 🎵`);
  },
};
