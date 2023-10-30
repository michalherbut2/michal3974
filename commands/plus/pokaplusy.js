const sqlite3 = require('sqlite3').verbose();

module.exports = {
  config: {
    name: "pokaplusy",
    description: "Displays the number of pluses for a user",
    usage: "pokaplusy <user>",
  },
  run: (client, message, args) => {
    const db = new sqlite3.Database("plusy.db");

    if (message.author.bot) return;

    const mentionedUser = message.mentions.users.first() || message.author;

    db.get(
      "SELECT pluses FROM pluses WHERE userID = ?",
      [mentionedUser.id],
      (err, row) => {
        if (err) {
          console.error("Database error:", err);
          return;
        }

        const userPluses = row ? row.pluses : 0;
        message.channel.send(`<@${mentionedUser.id}> ma ${userPluses} plusów!`);
      }
    );
  }
}
