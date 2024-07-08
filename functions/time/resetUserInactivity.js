const betterSqlite3 = require("better-sqlite3");

module.exports = (memberId, guildId) => {
  console.log(`usunięto <@${memberId}> `);
  const db = new betterSqlite3(`db/db_${guildId}.db`);
  db.prepare("DELETE FROM inactivity WHERE user_id = ?").run(memberId);
}
