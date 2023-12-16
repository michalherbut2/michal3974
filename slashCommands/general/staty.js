const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const sqlite = require('better-sqlite3');

const db = new sqlite('./database.db');

// Tworzenie tabeli w bazie danych, jeśli nie istnieje
const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS stats (
    guild_id TEXT,
    date TEXT,
    commands_executed INTEGER DEFAULT 0,
    messages_today INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    new_members_today INTEGER DEFAULT 0,
    voice_minutes_today INTEGER DEFAULT 0,
    reactions_received_today INTEGER DEFAULT 0,
    mentions_today INTEGER DEFAULT 0,
    PRIMARY KEY (guild_id, date)
  );
`);
createTable.run();

const commands = [
  {
    name: 'wyświetl_statystyki',
    description: 'Wyświetla statystyki serwera i ogólne statystyki',
  },
];

const rest = new REST({ version: '9' });
const YOUR_BOT_TOKEN = 'TWÓJ_TOKEN_BOTA';
const YOUR_GUILD_ID = 'TWÓJ_IDENTYFIKATOR_SERWERA';

(async () => {
  try {
    console.log('Rozpoczęto odświeżanie komend aplikacji (/).');

    await rest.put(
      Routes.applicationGuildCommands('TWÓJ_IDENTYFIKATOR_BOTA', YOUR_GUILD_ID),
      { body: commands },
    );

    console.log('Pomyślnie odświeżono komendy aplikacji (/).');
  } catch (error) {
    console.error(error);
  }
})();

// Funkcja do aktualizacji statystyk
function updateStats(guildId, message, member, reaction, user) {
  const today = new Date().toLocaleDateString();
  const stmt = db.prepare(`
    INSERT INTO stats (
      guild_id,
      date,
      commands_executed,
      messages_today,
      total_messages,
      new_members_today,
      voice_minutes_today,
      reactions_received_today,
      mentions_today
    )
    VALUES (?, ?, 1, 1, 1, 1, 0, 1, 1)
    ON CONFLICT(guild_id, date)
    DO UPDATE SET
      commands_executed = commands_executed + 1,
      messages_today = CASE
        WHEN date = ? THEN messages_today + 1
        ELSE 1
      END,
      total_messages = total_messages + 1,
      new_members_today = CASE
        WHEN date = ? THEN new_members_today + 1
        ELSE 0
      END,
      voice_minutes_today = voice_minutes_today,
      reactions_received_today = CASE
        WHEN date = ? THEN reactions_received_today + 1
        ELSE 0
      END,
      mentions_today = CASE
        WHEN date = ? THEN mentions_today + 1
        ELSE 0
      END
  `);

  stmt.run(guildId, today, today, today, today);
}

// Funkcja do pobierania statystyk
function getStats(guildId) {
  const stmt = db.prepare(`
    SELECT * FROM stats
    WHERE guild_id = ?
    ORDER BY date DESC
    LIMIT 31;
  `);
  return stmt.all(guildId);
}

// Funkcja do wyświetlania statystyk
function displayStats(guildId, channel) {
  const guildStats = getStats(guildId);
  const overallStats = getStats('overall');

  const guildEmbed = createStatsEmbed(guildStats, 'Statystyki Serwera');
  const overallEmbed = createStatsEmbed(overallStats, 'Ogólne Statystyki');

  channel.send(guildEmbed);
  channel.send(overallEmbed);
}

// Funkcja do tworzenia obiektu Embed Discord.js z statystykami
function createStatsEmbed(stats, title) {
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor('#3498db')
    .setTimestamp();

  stats.forEach(stat => {
    embed.addField(stat.date, formatStats(stat), true);
  });

  return embed;
}

// Funkcja do formatowania statystyk
function formatStats(stats) {
  return `
    Komendy Wykonane: ${stats.commands_executed}
    Wiadomości Dziś: ${stats.messages_today}
    Wiadomości Łącznie: ${stats.total_messages}
    Nowi Użytkownicy Dziś: ${stats.new_members_today}
    Minuty na Kanale Głosowym Dziś: ${stats.voice_minutes_today}
    Reakcje Otrzymane Dziś: ${stats.reactions_received_today}
    Wspomnienia Dziś: ${stats.mentions_today}
  `;
}
