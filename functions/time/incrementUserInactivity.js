module.exports = (userId, db) => {
  const row = db
    .prepare("SELECT inactivity_num FROM inactivity WHERE user_id = ?")
    .get(userId);
  const inactivityNum = row ? row.inactivity_num + 1 : 1;
  db.prepare(
    "INSERT OR REPLACE INTO inactivity (user_id, inactivity_num) VALUES (?, ?)"
  ).run(userId, inactivityNum);
};
