module.exports = {
  config: {
    name: "pause",
    description: "skip song",
    usage: `pause`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    client.queue.get(message.guild.id).player.pause();
    message.channel.send(`halt 🎵`);
  },
};
