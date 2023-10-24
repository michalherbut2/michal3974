const changeChannelName = require("../computings/changeChannelName.js");
const convertData = require("../computings/convertData.js");
const formatTable = require("../computings/formatTable.js");
const getData = require("../computings/getServerData");

module.exports = async client => {
    const updateTable = async () => {
      const channel = await client.channels.cache.get("1165600346949820436");
      const msg = await channel.messages.fetch("1165600637564760125");
      const data = await getData();
      const jsData = await convertData(data);
      const content = await formatTable(jsData);
      msg.edit(content);
      changeChannelName(channel, jsData);
    };
    await updateTable();
    // milisecond*seconds*minutes*hours
    const time = 1000 * 60 * 5; // 5 min
    setInterval(updateTable, time);
}
