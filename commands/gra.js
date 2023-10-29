const convertData = require("../computings/convertData");
const formatTable = require("../computings/formatTable");
const getServerData = require("../computings/getServerData");

module.exports = {
  config: {
    name: "gra",
    description: "Returns players list",
    usage: `gra`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    if (message.channel.id !== "1124032895263195199") return;
    switch (args[0]) {
      case "help":
        message.channel.send(
          `Wyświetla graczy i spędzony czas na serwerze
Składnia: !gra [OPCJA]
Dowolna OPCJA lub jej brak, wyświetli **Erlengrat**
!gra help - wyświetla pomoc`
        );
        return
    }
    const data = await getServerData();
    const jsData = await convertData(data);
    const content = await formatTable(jsData);
    message.channel.send(content);
  },
};
