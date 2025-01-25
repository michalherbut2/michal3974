module.exports = async (data) => {
  try {
    const nameSize = 28;
    const d = new Date();
    const time = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    let players = "";
    let counter = 1;

    if (!data || !data.Server || !data.Server.Slots || !data.Server.Slots[0].Player) {
      throw new Error("Invalid data format");
    }

    data.Server.Slots[0].Player.forEach(({ _, $ }) => {
      if (_ !== undefined) {
        players +=
          `${counter++}.`.padEnd(4) +
          `${_}`.padEnd(nameSize) +
          `${parseInt($.uptime / 60)}:` +
          `${($.uptime % 60).toString().padStart(2, "0")}` +
          ` h ${$.isAdmin === "true" ? "Admin👑" : ""}\n`;
      }
    });

    const output = players
      ? `Gracze na serwerze **${data.Server["$"].name}** o ${time}:\`\`\`ml\nNr  ${`Nazwa`.padEnd(nameSize)}Czas\n${players}\`\`\``
      : "Tu nikogo nie ma!";

    return output;
  } catch (error) {
    console.error("Error processing data:", error);
    return "Wystąpił błąd podczas przetwarzania danych.";
  }
};