module.exports = {
  config: {
    name: "queue",
    description: "shows queue songs",
    usage: `queue`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    if (!client.queue.get(message.guild.id).queue.length) {
      message.channel.send("Ludzie, tu niczego nie ma!");
    } else {
      message.channel.send(
        `Kolejka:\n${client.queue
          .get(message.guild.id)
          .queue.map((song, id) => `**${id ? id : "Gram"}**: ${song.metadata.title} - \`${song.metadata.duration}\``)
          .slice(0, 10)
          .join("\n")}`
      );
    }
  },
};


