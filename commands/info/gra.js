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
    
    const url ="http://137.74.4.51:8270/feed/dedicated-server-stats.xml?code=058e2a59bcd686de178691fedae13e98";
    
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
          players += `${counter++}. ${_} ${$.uptime} min\n`;
      });
      message.channel.send(
        !!players
          ? `Gracze na serwerze **${result.Server["$"].name}**:\n\n${players}`
          : "Tu nikogo nie ma!"
      );
    });
  },
};
