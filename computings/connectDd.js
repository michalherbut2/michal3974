const betterSqlite3 = require("better-sqlite3");

module.exports = async interaction => {
  const db = betterSqlite3(`db/db_${interaction.guild.id}.db`);
  db.pragma("journal_mode = WAL");
};
