module.exports = {
  name: "siema",
  category: "info",
  description: "Replay siema",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    message.channel.send(`Siema 👋`);
  },
};
