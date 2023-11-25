const { createSimpleEmbed } = require("../../computings/createEmbed");

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
    client.queue.get(message.guild.id).player.unpause();
    message.channel.send({ embeds: [createSimpleEmbed(`jazda 🎵`)] });
  },
};
