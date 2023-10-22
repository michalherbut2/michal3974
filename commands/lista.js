const changeChannelName = require("../computings/changeChannelName.js");
const convertData = require("../computings/convertData.js");
let formatTable = require("../computings/formatTable.js");
const getData = require("../computings/getServerData");
module.exports = {
  config: {
    name: "lista",
    description: "Refresh players list",
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
      const data = await getData();
      const jsData = await convertData(data)
      const content = await formatTable.formatTable(jsData);
      msg.edit(content);
      changeChannelName(message, jsData)      
    };
    xd();
    // milisecond*seconds*minutes*hours
    const time = 1000 * 60 * 5;
    if (client.interval) clearInterval(client.interval);
    client.interval = setInterval(xd, time);
  },
};
