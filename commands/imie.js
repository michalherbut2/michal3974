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
    const silageRecruitmentChannel = "1165725038608142439"
    const mainRecruitmentChannel = "1124032855492804681";

    if (mainRecruitmentChannel.includes(message.channel.id) ||
      silageRecruitmentChannel.includes(message.channel.id)) {
      message.react("✅");
      message.react("❌");
    }
  }
};
