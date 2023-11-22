module.exports = {
  config: {
    name: "skip",
    description: "skip song",
    usage: `skip`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if (args[0] && !isNaN(args[0])) {
      serverQueue.queue.filter((v, i) => i !== +args[0]);
      message.channel.send(`usunięto z ${args[0]} piosenkę z kolejki`);
    } else serverQueue.player.stop();
    // } else {  
    //   serverQueue.queue.shift()
    //   serverQueue.player.play(serverQueue.queue[0]);
    // }
  },
};
