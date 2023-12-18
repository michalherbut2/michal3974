const { createSimpleEmbed } = require("../../computings/createEmbed");
const ServerQueue = require("../../models/ServerQueue");

module.exports = {
  config: {
    name: "reset",
    description: "rest",
    usage: `reset`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    // let oldQueue= await client.queue.get(message.guild.id)
    // client.queue.get(message.guild.id).player.isPlaying;
    client.queue.set(message.guild.id,new ServerQueue())
    message.channel.send({ embeds: [createSimpleEmbed(`reset bota 🎵 `)] });
  },
};
