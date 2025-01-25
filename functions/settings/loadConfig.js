const betterSqlite3 = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const getConfig = require("./getConfig");

module.exports = async (client) => {
  try {
    // Iterate over each guild in the client's cache
    const databases = client.guilds.cache.map((guild) => {
      const dbPath = path.join(__dirname, `db/db_${guild.id}.db`);
      let db;

      // Check if the database file exists, if not, create it
      try {
        if (!fs.existsSync(dbPath)) {
          console.log(`Database for guild ${guild.name} (${guild.id}) does not exist. Creating...`);
          db = new betterSqlite3(dbPath);
          // Add any necessary table creation or initialization here
          db.exec(`CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)`);
        } else {
          db = new betterSqlite3(dbPath);
        }

        console.log(`Connected to database for guild ${guild.name} (${guild.id}).`);
      } catch (error) {
        console.error(`Failed to connect to database for guild ${guild.name} (${guild.id}):`, error);
        return null;
      }

      return { db, id: guild.id };
    }).filter(db => db !== null); // Filter out any null values in case of errors

    // Set PRAGMA and load configurations
    for (const db of databases) {
      try {
        db.db.pragma("journal_mode = WAL");
        const config = await getConfig(db.db);
        client.config.set(db.id, config);
        console.log(`Configuration loaded for guild ID: ${db.id}`);
      } catch (error) {
        console.error(`Failed to load configuration for guild ID: ${db.id}:`, error);
      } finally {
        try {
          db.db.close();
          console.log(`Database closed for guild ID: ${db.id}`);
        } catch (closeError) {
          console.error(`Failed to close database for guild ID: ${db.id}:`, closeError);
        }
      }
    }
  } catch (globalError) {
    console.error("An unexpected error occurred during database initialization:", globalError);
  }
};