const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./user_activity.db");
module.exports = userId => {
  db.get(
    "SELECT inactivity_days FROM users WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err)
        console.error("Błąd podczas pobierania informacji o użytkowniku:", err);

      const inactivityDays = row ? row.inactivity_days + 1 : 1;
      db.run(
        "INSERT OR REPLACE INTO users (user_id, inactivity_days) VALUES (?, ?)",
        [userId, inactivityDays],
        err => {
          if (err)
            console.error(
              "Błąd podczas aktualizacji informacji o użytkowniku:",
              err
            );
        }
      );
    }
  );
};
