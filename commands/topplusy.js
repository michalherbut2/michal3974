const sqlite3 = require('sqlite3').verbose();

module.exports = {
  config: {
    name: 'topplusy',
    description: 'Displays the top 10 users with the most pluses',
    usage: 'topplusy',
  },
  run: (client, message, args) => {
    const db = new sqlite3.Database('./plusy.db');

    if (message.author.bot) return;

    db.all('SELECT userID, pluses FROM pluses ORDER BY pluses DESC LIMIT 10', (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return;
      }

      if (rows.length === 0) {
        message.channel.send('Brak danych o plusach w bazie.');
        return;
      }

      let topUsers = 'Top 10 użytkowników z największą ilością plusów:\n';

      rows.forEach((row, index) => {
        const user = client.users.cache.get(row.userID);
        topUsers += `${index + 1}. ${user ? user.tag : 'Nieznany użytkownik'} - ${row.pluses} plusów\n`;
      });

      message.channel.send(topUsers);
    });
  },
};