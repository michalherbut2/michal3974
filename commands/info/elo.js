const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "elo",
  category: "info",
  description: "Returns latency and API elo",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const msg = await message.channel.send(`🏓 elo...`);
    const embed = new MessageEmbed()
      .setTitle("Siema!")
      .setDescription(
        `WebSocket ping is ${
          client.ws.ping
        }MS\nMessage edit ping is ${Math.floor(
          msg.createdAt - message.createdAt
        )}MS!`
      );
    await message.channel.send(embed);
    msg.delete();
  },
};
