const betterSqlite3 = require("better-sqlite3");
const getConfig = require("./getConfig");

module.exports = async client => {
  // client.guilds.cache.forEach(guild => console.log("elo", guild.name, guild.id));
  const databases = client.guilds.cache.map(guild => ({
    db: new betterSqlite3(`db/db_${guild.id}.db`),
    id: guild.id,
  }));
  // console.log(databases);
  for (const db of databases) {
    db.db.pragma("journal_mode = WAL");
    client.config.set(db.id, await getConfig(db.db));
    db.db.close();
  }
};