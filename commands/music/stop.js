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
    client.queue.get(message.guild.id).queue = [];
    client.queue.get(message.guild.id).player.stop();
  },
};
