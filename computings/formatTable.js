const xml2js = require("xml2js");
const getData = require("../computings/getServerData");

module.exports.formatTable = async () => {
  const parser = new xml2js.Parser();
  const nameSize = 28;
  const data = await getData()
  let output
  const d = new Date();
  const time=`${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
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

    // message.channel.send(
    output = !!players
      ? `Gracze na serwerze **${
          result.Server["$"].name
        }** o ${time}:\`\`\`ml\nNr  ${`Nazwa`.padEnd(
          nameSize
        )}Czas\n${players}\`\`\``
      : "Tu nikogo nie ma!";
    // );
  });
  return output
};
