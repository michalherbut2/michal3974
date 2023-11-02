const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./user_activity.db");
module.exports = userId => {
  db.run(
    "UPDATE users SET inactivity_days = 0 WHERE user_id = ?",
    [userId],
    err => {
      if (err)
        console.error("Błąd podczas resetowania licznika nieobecności:", err);
    }
  );
}
