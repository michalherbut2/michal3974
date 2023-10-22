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
    // await console.log(client);
    // const channel = await client.channels.fetch("1165324807638884483");
    const url =
      "http://137.74.7.100:5014/feed/dedicated-server-stats.xml?code=d52a95989e08e61863c06f63e49f4464";
    // const messages = await channel.messages.fetch()
    switch (args[0]) {
      case "help":
        message.channel.send(
          `Wyświetla graczy i spędzony czas na serwerze
Składnia: !gra [OPCJA]
Dowolna OPCJA lub jej brak, wyświetli **Erlengrat**
!gra help - wyświetla pomoc`
        )
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
      // console.log(messages.size);
    // if (messages.size === 0)
      message.channel.send(
        !!players
          ? `Gracze na serwerze **${
              result.Server["$"].name
            }**:\`\`\`ml\nNr  ${`Nazwa`.padEnd(nameSize)}Czas\n${players}\`\`\``
          : "Tu nikogo nie ma!"
      );
    // else
    //   console.log(messages["1133329234673270785"]);
      // for (const message of messages) {
      //   message.
      // }
      // messages[messages.size-1][1].edit("elo");
      
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
