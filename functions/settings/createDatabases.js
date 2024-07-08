const betterSqlite3 = require("better-sqlite3");

module.exports = async client => {
  // client.guilds.cache.forEach(guild => console.log("elo", guild.name, guild.id));
  const databases = client.guilds.cache.map(guild => new betterSqlite3(`db/db_${guild.id}.db`))
  const createInactivityTable = "CREATE TABLE IF NOT EXISTS inactivity (user_id TEXT PRIMARY KEY, inactivity_num INTEGER DEFAULT 0)"
  const createPlusTable = "CREATE TABLE IF NOT EXISTS plus (user_id TEXT PRIMARY KEY, plus_num INTEGER, reason TEXT DEFAULT '')"
  const createWarnTable = "CREATE TABLE IF NOT EXISTS warn (user_id TEXT PRIMARY KEY, warn_num INTEGER DEFAULT 1, reason TEXT DEFAULT '')"
  const createConfigTable = "CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)"
  const createTaskTable = "CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY, user_id TEXT, date TEXT, content TEXT, additional_info TEXT)"
  
  databases.forEach(db => {
    db.pragma("journal_mode = WAL");
    db.prepare(createInactivityTable).run()
    db.prepare(createPlusTable).run();
    db.prepare(createWarnTable).run();
    db.prepare(createConfigTable).run();
    db.prepare(createTaskTable).run();
    db.close()
  })
};
