module.exports = {
  config: {
    name: "imie",
    description: "Refresh players list",
    usage: `Imię`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const channel = "1165725038608142439"
    if (channel.includes(message.channel.id)) {
      message.react("✅");
      message.react("❌");
    }
  }
};
