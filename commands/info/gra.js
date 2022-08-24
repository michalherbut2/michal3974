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
    
    elrengrat="http://62.104.67.26:24211/feed/dedicated-server-stats.xml?code=600fdd830ec26f3869f78a52fec78cf3"
    cos="http://62.104.67.219:22711/feed/dedicated-server-stats.xml?code=f0d115f68b7e54e7ca7028316da5b1b6"
    kiszonka = "http://173.199.107.43:18131/feed/dedicated-server-stats.xml?code=727abb5e6636298712ede57477209220"
    
    let url=''

    switch (args[0]) {
      case "2":
        url = kiszonka;
        break;

      case "3":
        url = cos;
        break;

      default:
        url = elrengrat;
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
          ? `Lista graczy na serwerze **${result.Server["$"].name.substring(
              0,
              13
            )}**:\n\n${players}`
          : "Tu nikogo nie ma!"
      );
    });
  },
};
