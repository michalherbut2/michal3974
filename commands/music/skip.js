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
    if (args[0] && !isNaN(args[0])) {
      client.queue = client.queue.filter((v, i) => i !== +args[0]);
      message.channel.send(`usunięto z ${args[0]} piosenkę z kolejki`);
    } else client.player.stop();
  },
};
