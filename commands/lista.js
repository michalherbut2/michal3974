let formatTable = require("../computings/formatTable.js");
module.exports = {
  config: {
    name: "lista",
    description: "Returns players list",
    usage: `lista`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    const xd = async () => {
      const msg = await message.channel.messages.fetch("1165600637564760125");
      const content = await formatTable.formatTable();
      msg.edit(content);

      // console.log(content);
    };
    xd()
    // milisecond*seconds*minutes*hours
    const time=1000*60*5
    setInterval(xd, time);
  }
};
