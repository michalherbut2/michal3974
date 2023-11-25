const { createSimpleEmbed } = require("../../computings/createEmbed");

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
    const queue = client.queue.get(message.guild.id).queue;
    if (!queue.length) {
      message.channel.send("Ludzie, tu niczego nie ma!");
    } else {
      const content = `## Kolejka:\n${queue
        .map(
          (song, id) =>
            `**${id ? id : "Gram"}**: ${song.metadata.title} - \`${
              song.metadata.duration
            }\``
        )
        .join("\n")}`;
      message.channel.send({ embeds: [createSimpleEmbed(content)] });
    }
  },
};


