const xml2js = require("xml2js");
const { default: axios } = require("axios");

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
    const url =
      "http://62.104.10.222:8080/feed/dedicated-server-stats.xml?code=9e2a03bc3138eddae0928cba19d421a6";

    switch (args[0]) {
      case "help":
        message.channel.send(
          `Wyświetla graczy i spędzony czas na serwerze
Składnia: !gra [OPCJA]
Dowolna OPCJA lub jej brak, wyświetli **Erlengrat**
!gra help - wyświetla pomoc`
        );
        return;
        break;
    }

    const { data } = await axios({
      method: "get",
      url: url,
    });

    const parser = new xml2js.Parser();
    const nameSize = 28

    parser.parseString(data, (err, result) => {
      players = "";
      counter = 1;
      result.Server.Slots[0].Player.forEach(({ _, $ }) => {
        if (_ !== undefined)
          players +=
            `${counter++}.`.padEnd(4) +
            `${_}`.padEnd(nameSize) +
            `${parseInt($.uptime / 60)}:` +
            `${$.uptime % 60}`.padStart(2, "0") +
            ` h ${$.isAdmin === "true" ? "Admin👑" : ""}\n`;
      });
      message.channel.send(
        !!players
          ? `Gracze na serwerze **${
              result.Server["$"].name
            }**:\`\`\`ml\nNr  ${`Nazwa`.padEnd(nameSize)}Czas\n${players}\`\`\``
          : "Tu nikogo nie ma!"
      );
      // console.log(
      //   !!players
      //     ? `Gracze na serwerze **${
      //         result.Server["$"].name
      //       }**:\`\`\`ml\nNr  ${`Nazwa`.padEnd(nameSize)}Czas\n${players}\`\`\``
      //     : "Tu nikogo nie ma!"
      // );
    });
  },
};
