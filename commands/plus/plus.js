const checkRole = require('../../computings/checkRole');

const sqlite3 = require('sqlite3').verbose();

module.exports = {
  config: {
    name: 'plus',
    description: 'Returns players list',
    usage: 'plus',
  },
  run: (client, message, args) => {
    // console.log("dupa");
    const db = new sqlite3.Database('plusy.db');

    db.serialize(() => {
      // Create a table to store the pluses if it doesn't exist
      db.run(
        'CREATE TABLE IF NOT EXISTS pluses (userID TEXT, pluses INTEGER)'
        // 'CREATE TABLE IF NOT EXISTS pluses (userID TEXT PRIMARY KEY, pluses INTEGER)'
      );
    });

   
    if (message.author.bot) return;

      // Add a plus to a mentioned user if the command and permissions are correct
    if (message.member.roles.cache.has("995764104876798072")) {
      // console.log(message.member);
      let liczbaPlusow = args[1];
      const mentionedUser = message.mentions.users.first();

      if (mentionedUser) {
        const userID = mentionedUser.id;
        let isSet = false;
        if (liczbaPlusow.startsWith("=")) {
          liczbaPlusow = +liczbaPlusow.slice(1);
          isSet = true;
        } else liczbaPlusow = +liczbaPlusow;

        // Check if the user already exists in the database
        db.get(
          "SELECT pluses FROM pluses WHERE userID = ?",
          [userID],
          (err, row) => {
            if (err) {
              console.error("Database error:", err);
              return;
            }

            const existingPluses = row ? row.pluses : 0;

            // Add the pluses to the existing count or create a new entry

            const totalPluses = isSet
              ? liczbaPlusow
              : existingPluses + liczbaPlusow;

            if (totalPluses >= 10)
              checkRole(message, userID);
            
            db.run(
              row
                ? "UPDATE pluses SET pluses = $1 WHERE userID = $2"
                : "INSERT INTO pluses (pluses, userID) VALUES ($1,$2)",
              [totalPluses, userID],
              err => {
                if (err) {
                  console.error("Database error:", err);
                  return;
                }
                message.channel.send(
                  `${liczbaPlusow} plus(y) zostały dodane dla użytkownika ${mentionedUser.tag}.`
                );
              }
            );
          }
        );
      }
    }else message.channel.send(`Nie masz prawa`);
  },
};