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
    jDiscord="http://62.104.67.26:24211/feed/dedicated-server-stats.xml?code=600fdd830ec26f3869f78a52fec78cf3"
    kiszonkaJ="http://62.104.67.219:22711/feed/dedicated-server-stats.xml?code=f0d115f68b7e54e7ca7028316da5b1b6"
    const url = !!args[0] ? kiszonkaJ : jDiscord
    console.log(args,!!args[0]);
    
    const {data} = await axios({
      method: 'get',
      url: url,
    })
    
    const parser = new xml2js.Parser();

    parser.parseString(data, (err, result) => {
      // players = "";
      console.log();

      players = '';
      counter=1
      result.Server.Slots[0].Player.forEach(({ _, $ }) => {
        if (_ !== undefined)
          players += `${counter++}. ${_} ${$.uptime} min\n`;
      });
      const msg = message.channel.send(
        !!players
          ? `Lista graczy na serwerze **${result.Server["$"].name.substring(
              0,
              13
            )}**:\n\n${players}`
          : "Tu nikogo nie ma!"
      );
    });

    // msg.delete();
  },
};
