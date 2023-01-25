const xml2js = require("xml2js");
const { default: axios } = require("axios");

module.exports = {
  name: "gra",
  category: "info",
  description: "Returns players list",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    
    const url = "http://62.104.10.222:8080/feed/dedicated-server-stats.xml?code=9e2a03bc3138eddae0928cba19d421a6";
    
    switch (args[0]) {
      case "help":
        message.channel.send(
`Wyświetla graczy i spędzony czas na serwerze
Składnia: !gra [OPCJA]
Dowolna OPCJA lub jej brak, wyświetli **Erlengrat**
!gra help - wyświetla pomoc`)
        return
        break;
    }

    const {data} = await axios({
      method: 'get',
      url: url,
    })
    
    const parser = new xml2js.Parser();

    parser.parseString(data, (err, result) => {
      players = '';
      counter=1
      result.Server.Slots[0].Player.forEach(({ _, $ }) => {
        if (_ !== undefined)
          players +=
            `${counter++}.`.padEnd(4) +
            `${_}`.padEnd(21) +
            `${$.uptime}`.padStart(3) +
            ` min ${$.isAdmin === 'true' ? 'Admin👑' : ''}\n`;
      });
      message.channel.send(
        !!players
          ? `Gracze na serwerze **${
              result.Server["$"].name
            }**:\`\`\`ml\nNr  ${`Nazwa`.padEnd(24)}Czas\n${players}\`\`\``
          : "Tu nikogo nie ma!"
      );
    });
  },
};
