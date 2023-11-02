const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./user_activity.db");

module.exports = {
  config: {
    name: "nb",
    description: "show",
    usage: `nb`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    db.all("SELECT * FROM users", async (err, rows) => {
      if (err)
        console.error("Błąd podczas pobierania informacji o użytkowniku:", err);

      if (rows.length === 0) {
        message.channel.send("Brak danych o plusach w bazie.");
        return;
      }
      let index = 1;
      let mes = "```Lista nieobecnośći (7 nieobecności utrata admina):";
      for (const row of rows) {
        const member = await message.guild.members.fetch(row.user_id);
        const nick = member?.nickname ? member.nickname : member?.user?.globalName;
        mes += `\n${index++}. ${nick.padEnd(19)} - ${row.inactivity_days} nieobecności`;
      }
      message.channel.send(mes+'```');
    });
  },
};
