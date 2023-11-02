module.exports = {
  config: {
    name: "lista",
    description: "shows queue songs",
    usage: `lista`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message);
    if (!queue) {
      message.channel.send("Ludzie, tu niczego nie ma!");
    } else {
      message.channel.send(
        `Kolejka:\n${queue.songs
          .map(
            (song, id) =>
              `**${id ? id : "Gram"}**. ${song.name} - \`${
                song.formattedDuration
              }\``
          )
          .slice(0, 10)
          .join("\n")}`
      );
    }
  },
};


