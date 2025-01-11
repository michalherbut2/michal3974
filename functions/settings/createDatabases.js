const betterSqlite3 = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
  // Define SQL commands for creating tables
  const createInactivityTable = `
    CREATE TABLE IF NOT EXISTS inactivity (
      user_id TEXT PRIMARY KEY, 
      inactivity_num INTEGER DEFAULT 0
    )`;
  const createPlusTable = `
    CREATE TABLE IF NOT EXISTS plus (
      user_id TEXT PRIMARY KEY, 
      plus_num INTEGER, 
      reason TEXT DEFAULT ''
    )`;
  const createWarnTable = `
    CREATE TABLE IF NOT EXISTS warn (
      user_id TEXT PRIMARY KEY, 
      warn_num INTEGER DEFAULT 1, 
      reason TEXT DEFAULT ''
    )`;
  const createConfigTable = `
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY, 
      value TEXT
    )`;
  const createTaskTable = `
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY, 
      user_id TEXT, 
      date TEXT, 
      content TEXT, 
      additional_info TEXT
    )`;

  // Ensure the database directory exists
  const dbDirectory = path.join(__dirname, 'db');
  if (!fs.existsSync(dbDirectory)) {
    try {
      fs.mkdirSync(dbDirectory, { recursive: true });
      console.log(`Database directory created at ${dbDirectory}`);
    } catch (error) {
      console.error(`Failed to create database directory:`, error);
      return;
    }
  }

  // Iterate over each guild in the client's cache
  const databases = client.guilds.cache.map((guild) => {
    const dbPath = path.join(dbDirectory, `db_${guild.id}.db`);
    let db;

    // Check if the database file exists, if not, create it
    try {
      if (!fs.existsSync(dbPath)) {
        console.log(`Database for guild ${guild.name} (${guild.id}) does not exist. Creating...`);
        db = new betterSqlite3(dbPath);
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

  // Set PRAGMA and create tables
  for (const { db, id } of databases) {
    try {
      db.pragma("journal_mode = WAL");
      db.prepare(createInactivityTable).run();
      db.prepare(createPlusTable).run();
      db.prepare(createWarnTable).run();
      db.prepare(createConfigTable).run();
      db.prepare(createTaskTable).run();
      console.log(`Tables created for guild ID: ${id}`);
    } catch (error) {
      console.error(`Failed to create tables for guild ID: ${id}:`, error);
    } finally {
      try {
        db.close();
        console.log(`Database closed for guild ID: ${id}`);
      } catch (closeError) {
        console.error(`Failed to close database for guild ID: ${id}:`, closeError);
      }
    }
  }
};