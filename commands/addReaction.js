module.exports = {
  config: {
    name: "add",
    description: "Replay siema",
    usage: `add`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (bot, message, args) => {
    const channel = await bot.channels.cache.get(args[0]);
    const msg = await channel.messages.fetch(args[1]);
    msg.react("✅");
    msg.react("❌");
  },
};