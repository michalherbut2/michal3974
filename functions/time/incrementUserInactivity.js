module.exports = (userId, db) => {
  try {
    // Fetch the current inactivity number for the user
    const row = db
      .prepare("SELECT inactivity_num FROM inactivity WHERE user_id = ?")
      .get(userId);

    // Increment the inactivity number or set it to 1 if the user is not found
    const inactivityNum = row ? row.inactivity_num + 1 : 1;

    // Insert or replace the inactivity record for the user
    db.prepare(
      "INSERT OR REPLACE INTO inactivity (user_id, inactivity_num) VALUES (?, ?)"
    ).run(userId, inactivityNum);

    console.log(`Updated inactivity for user ${userId} to ${inactivityNum}`);
  } catch (error) {
    // Log any errors that occur during the database operations
    console.error(`Failed to update inactivity for user ${userId}:`, error);
  }
};