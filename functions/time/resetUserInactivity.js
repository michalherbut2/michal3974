const betterSqlite3 = require("better-sqlite3");

module.exports = (memberId, guildId) => {
  try {
    console.log(`usunięto <@${memberId}>`);

    // Initialize the database connection
    const db = new betterSqlite3(`db/db_${guildId}.db`);

    // Delete the inactivity record for the given user
    const statement = db.prepare("DELETE FROM inactivity WHERE user_id = ?");
    const result = statement.run(memberId);

    // Check if any row was deleted
    if (result.changes > 0) {
      console.log(`Inactivity record for user ${memberId} has been deleted.`);
    } else {
      console.log(`No inactivity record found for user ${memberId}.`);
    }
  } catch (error) {
    // Log any errors that occur during the database operations
    console.error(`Failed to delete inactivity record for user ${memberId}:`, error);
  } finally {
    // Ensure the database connection is closed
    try {
      db.close();
      console.log(`Database connection closed for guild ${guildId}.`);
    } catch (closeError) {
      console.error(`Failed to close database connection for guild ${guildId}:`, closeError);
    }
  }
};