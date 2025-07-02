const betterSqlite3 = require("better-sqlite3");

// Function to get all timeouts
exports.getAllTimeouts = async (guildId, limit = 10) => {
  try {
    const db = new betterSqlite3(`db/db_${guildId}.db`);
    const stmt = db.prepare(`
      SELECT * FROM timeout 
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    
    const results = stmt.all(limit);
    db.close();
    return results;
  } catch (error) {
    console.error("Error getting timeouts:", error);
    return [];
  }
};

// Function to get timeouts by user
exports.getUserTimeouts = async (guildId, userId) => {
  try {
    const db = new betterSqlite3(`db/db_${guildId}.db`);
    const stmt = db.prepare(`
      SELECT * FROM timeout 
      WHERE target_id = ?
      ORDER BY timestamp DESC
    `);
    
    const results = stmt.all(userId);
    db.close();
    return results;
  } catch (error) {
    console.error("Error getting user timeouts:", error);
    return [];
  }
};

// Function to get timeouts given by a specific user
exports.getTimeoutsByExecutor = async (guildId, executorId) => {
  try {
    const db = new betterSqlite3(`db/db_${guildId}.db`);
    const stmt = db.prepare(`
      SELECT * FROM timeout 
      WHERE executor_id = ?
      ORDER BY timestamp DESC
    `);
    
    const results = stmt.all(executorId);
    db.close();
    return results;
  } catch (error) {
    console.error("Error getting executor timeouts:", error);
    return [];
  }
};