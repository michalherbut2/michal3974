const betterSqlite3 = require("better-sqlite3");

module.exports = async (guildId, targetId, executorId, reason, duration, action) => {
  try {
    const db = new betterSqlite3(`db/db_${guildId}.db`);
    
    const stmt = db.prepare(`
      INSERT INTO timeout (target_id, executor_id, reason, duration, action, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      targetId,
      executorId,
      reason || "",
      duration || "",
      action, // "add" or "remove"
      Date.now()
    );
    
    db.close();
    return result;
  } catch (error) {
    console.error("Error saving timeout to database:", error);
    return null;
  }
};