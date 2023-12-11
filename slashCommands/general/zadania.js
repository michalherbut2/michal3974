const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const { setTimeout, setInterval } = require('timers/promises');
const { v4: uuidv4 } = require('uuid');

const client = new Discord.Client();
const prefix = '!';

const db = new sqlite3.Database('tasks.db');

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    serverId TEXT,
    userId TEXT,
    date TEXT,
    content TEXT,
    additionalInfo TEXT
  )
`);

client.on('message', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    switch (command) {
      case 'addtask':
        await addTask(message, args);
        break;
      case 'listtasks':
        await listTasks(message);
        break;
      case 'listalltasks':
        await listAllTasks(message);
        break;
      case 'showtask':
        await showTask(message, args);
        break;
      case 'removetask':
        await removeTask(message, args);
        break;
      case 'updatetasks':
        await updateTasks();
        message.reply('Zadania zostały zaktualizowane.');
        break;
      case 'cleartasks':
        await clearTasks(message);
        message.reply('Wszystkie zadania na serwerze zostały usunięte.');
        break;
    }
  } catch (error) {
    console.error(error.message);
    message.reply('Wystąpił błąd podczas wykonania komendy.');
  }
});

setInterval(updateTasks, 15 * 60 * 1000);

async function addTask(message, args) {
  const date = args[0];
  const content = args.slice(1, -1).join(' ');
  const additionalInfo = args[args.length - 1];

  if (!date || !content || !additionalInfo) {
    throw new Error('Użycie: !addtask <data wykonania> <treść zadania> <dodatkowe informacje>');
  }

  try {
    const taskId = uuidv4();
    await db.run('INSERT INTO tasks (id, serverId, userId, date, content, additionalInfo) VALUES (?, ?, ?, ?, ?, ?)', [
      taskId,
      message.guild.id,
      message.author.id,
      date,
      content,
      additionalInfo,
    ]);

    message.reply(`Zadanie zostało dodane pomyślnie! ID zadania: ${taskId}`);
    await setReminders(message.guild.id, message.author.id, date, content);
  } catch (dbError) {
    console.error('Błąd bazy danych przy dodawaniu zadania:', dbError.message);
    message.reply('Wystąpił błąd podczas dodawania zadania. Spróbuj ponownie.');
  }
}

async function listTasks(message) {
  try {
    const rows = await db.all('SELECT id, date, content FROM tasks WHERE userId = ? AND serverId = ?', [message.author.id, message.guild.id]);

    if (rows.length === 0) {
      message.reply('Brak zaplanowanych zadań.');
      return;
    }

    const taskList = rows.map((row) => `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`);
    message.reply(`Lista zadań:\n${taskList.join('\n')}`);
  } catch (dbError) {
    console.error('Błąd bazy danych przy listowaniu zadań:', dbError.message);
    message.reply('Wystąpił błąd podczas pobierania listy zadań. Spróbuj ponownie.');
  }
}

async function listAllTasks(message) {
  try {
    const rows = await db.all('SELECT id, date, content FROM tasks WHERE serverId = ?', [message.guild.id]);

    if (rows.length === 0) {
      message.reply('Brak zaplanowanych zadań na serwerze.');
      return;
    }

    const taskList = rows.map((row) => `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`);
    message.reply(`Lista wszystkich zadań na serwerze:\n${taskList.join('\n')}`);
  } catch (dbError) {
    console.error('Błąd bazy danych przy listowaniu wszystkich zadań:', dbError.message);
    message.reply('Wystąpił błąd podczas pobierania listy zadań. Spróbuj ponownie.');
  }
}

async function showTask(message, args) {
  const taskId = args[0];

  if (!taskId) {
    throw new Error('Użycie: !showtask <ID zadania>');
  }

  try {
    const row = await db.get('SELECT * FROM tasks WHERE id = ? AND serverId = ?', [taskId, message.guild.id]);

    if (!row) {
      throw new Error('Nie znaleziono zadania o podanym ID na serwerze.');
    }

    message.reply(
      `Szczegóły zadania (ID: ${row.id}):\nData: ${formatDate(row.date)}\nTreść: ${row.content}\nDodatkowe informacje: ${row.additionalInfo}`
    );
  } catch (dbError) {
    console.error('Błąd bazy danych przy pokazywaniu szczegółów zadania:', dbError.message);
    message.reply('Wystąpił błąd podczas pobierania informacji o zadaniu. Spróbuj ponownie.');
  }
}

async function removeTask(message, args) {
  const taskId = args[0];

  if (!taskId) {
    throw new Error('Użycie: !removetask <ID zadania>');
  }

  try {
    const result = await db.run('DELETE FROM tasks WHERE id = ? AND serverId = ?', [taskId, message.guild.id]);

    if (result.changes === 0) {
      throw new Error('Nie znaleziono zadania o podanym ID na serwerze.');
    }

    message.reply('Zadanie zostało usunięte pomyślnie.');
  } catch (dbError) {
    console.error('Błąd bazy danych przy usuwaniu zadania:', dbError.message);
    message.reply('Wystąpił błąd podczas usuwania zadania. Spróbuj ponownie.');
  }
}

async function updateTasks() {
  try {
    const rows = await db.all('SELECT * FROM tasks');

    for (const row of rows) {
      const taskDate = new Date(row.date);
      const currentTime = new Date();

      if (taskDate.getTime() <= currentTime.getTime() + 15 * 60 * 1000) {
        const user = await client.users.fetch(row.userId);
        user.send(
          `Przypomnienie: Masz zadanie "${row.content}" do wykonania w ciągu 15 minut! Dodatkowe informacje: ${row.additionalInfo}`
        );
      }
    }
  } catch (dbError) {
    console.error('Błąd bazy danych przy aktualizacji zadań:', dbError.message);
  }
}

async function setReminders(serverId, userId, date, content) {
  try {
    const taskDate = new Date(date);
    const oneDayBefore = new Date(taskDate.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(taskDate.getTime() - 60 * 60 * 1000);

    await setTimeout(() => {
      client.guilds.fetch(serverId).then((guild) => {
        guild.members.fetch(userId).then((user) => {
          user.send(`Przypomnienie: Masz zadanie "${content}" do wykonania za 24 godziny!`);
        });
      });
    }, oneDayBefore.getTime() - Date.now());

    await setTimeout(() => {
      client.guilds.fetch(serverId).then((guild) => {
        guild.members.fetch(userId).then((user) => {
          user.send(`Przypomnienie: Masz zadanie "${content}" do wykonania za 1 godzinę!`);
        });
      });
    }, oneHourBefore.getTime() - Date.now());
  } catch (error) {
    console.error('Błąd podczas ustawiania przypomnień:', error.message);
  }
}

async function clearTasks(message) {
  try {
    await db.run('DELETE FROM tasks WHERE serverId = ?', [message.guild.id]);
  } catch (dbError) {
    console.error('Błąd bazy danych przy usuwaniu zadań:', dbError.message);
    message.reply('Wystąpił błąd podczas usuwania zadań. Spróbuj ponownie.');
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  const formattedDate = new Date(dateString).toLocaleDateString('pl-PL', options);
  return formattedDate;
}


