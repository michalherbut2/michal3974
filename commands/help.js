module.exports = {
  config: {
    name: "help",
    description: "shows all commands",
    usage: `help`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    message.channel.send(`play\nskip\npause\nunpause\nlista`);
  },
};
