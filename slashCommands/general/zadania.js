const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Database = require('better-sqlite3');
const { setTimeout, setInterval } = require('timers/promises');
const { v4: uuidv4 } = require('uuid');

const clientId = 'TUTAJ_TWÓJE_CLIENT_ID';
const guildId = 'TUTAJ_TWÓJE_GUILD_ID';


const commands = [
  {
    name: 'addtask',
    description: 'Dodaj nowe zadanie',
    options: [
      {
        name: 'date',
        type: 'INTEGER',
        description: 'Data wykonania zadania (np. 1, 2, 3)',
        required: true,
      },
      {
        name: 'content',
        type: 'STRING',
        description: 'Treść zadania',
        required: true,
      },
      {
        name: 'additionalinfo',
        type: 'STRING',
        description: 'Dodatkowe informacje dotyczące zadania',
        required: true,
      },
    ],
  },
  {
    name: 'listtasks',
    description: 'Wyświetl listę zadań',
  },
  {
    name: 'listalltasks',
    description: 'Wyświetl listę wszystkich zadań na serwerze',
  },
  {
    name: 'removetask',
    description: 'Usuń zadanie',
    options: [
      {
        name: 'taskid',
        type: 'STRING',
        description: 'ID zadania do usunięcia',
        required: true,
      },
    ],
  },
  {
    name: 'updatetasks',
    description: 'Aktualizuj zadania',
  },
  {
    name: 'cleartasks',
    description: 'Wyczyść wszystkie zadania na serwerze',
  },
];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const db = new Database('tasks.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    serverId TEXT,
    userId TEXT,
    date TEXT,
    content TEXT,
    additionalInfo TEXT
  )
`).run();

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  try {
    switch (commandName) {
      case 'addtask':
        await addTask(interaction, options);
        break;
      case 'listtasks':
        await listTasks(interaction);
        break;
      case 'listalltasks':
        await listAllTasks(interaction);
        break;
      case 'removetask':
        await removeTask(interaction, options);
        break;
      case 'updatetasks':
        await updateTasks();
        await interaction.reply('Zadania zostały zaktualizowane.');
        break;
      case 'cleartasks':
        await clearTasks(interaction);
        await interaction.reply('Wszystkie zadania na serwerze zostały usunięte.');
        break;

      default:
        break;
    }
  } catch (error) {
    console.error(error.message);
    await interaction.reply('Wystąpił błąd podczas wykonania komendy.');
  }
});



async function addTask(interaction, options) {
  const date = options.getInteger('date');
  const content = options.getString('content');
  const additionalInfo = options.getString('additionalinfo');

  if (!Number.isInteger(date) || !content || !additionalInfo) {
    throw new Error('Użycie: /addtask date content additionalinfo');
  }

  try {
    const taskId = uuidv4();
    db.prepare('INSERT INTO tasks (id, serverId, userId, date, content, additionalInfo) VALUES (?, ?, ?, ?, ?, ?)').run(
      taskId,
      interaction.guild.id,
      interaction.user.id,
      date,
      content,
      additionalInfo
    );

    await interaction.reply(`Zadanie dodane pomyślnie! ID zadania: ${taskId}`);
    await setReminders(interaction.guild.id, interaction.user.id, date, content);
  } catch (dbError) {
    console.error('Błąd bazy danych podczas dodawania zadania:', dbError.message);
    await interaction.reply('Wystąpił błąd podczas dodawania zadania. Spróbuj ponownie.');
  }
}

async function listTasks(interaction) {
  try {
    const rows = db.prepare('SELECT id, date, content FROM tasks WHERE userId = ? AND serverId = ?').all(
      interaction.user.id,
      interaction.guild.id
    );

    if (rows.length === 0) {
      await interaction.reply('Brak zaplanowanych zadań.');
      return;
    }

    const taskList = rows.map((row) => `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`);
    await interaction.reply(`Lista zadań:\n${taskList.join('\n')}`);
  } catch (dbError) {
    console.error('Błąd bazy danych przy listowaniu zadań:', dbError.message);
    await interaction.reply('Wystąpił błąd podczas pobierania listy zadań. Spróbuj ponownie.');
  }
}

async function listAllTasks(interaction) {
  try {
    const rows = db.prepare('SELECT id, date, content FROM tasks WHERE serverId = ?').all(
      interaction.guild.id
    );

    if (rows.length === 0) {
      await interaction.reply('Brak zaplanowanych zadań na serwerze.');
      return;
    }

    const taskList = rows.map((row) => `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`);
    await interaction.reply(`Lista wszystkich zadań na serwerze:\n${taskList.join('\n')}`);
  } catch (dbError) {
    console.error('Błąd bazy danych przy listowaniu wszystkich zadań:', dbError.message);
    await interaction.reply('Wystąpił błąd podczas pobierania listy zadań. Spróbuj ponownie.');
  }
}

async function removeTask(interaction, options) {
  const taskId = options.getString('taskid');

  if (!taskId) {
    throw new Error('Użycie: /removetask taskid');
  }

  try {
    const result = db.prepare('DELETE FROM tasks WHERE id = ? AND serverId = ?').run(taskId, interaction.guild.id);

    if (result.changes === 0) {
      throw new Error('Nie znaleziono zadania o podanym ID na serwerze.');
    }

    await interaction.reply('Zadanie zostało usunięte pomyślnie.');
  } catch (dbError) {
    console.error('Błąd bazy danych przy usuwaniu zadania:', dbError.message);
    await interaction.reply('Wystąpił błąd podczas usuwania zadania. Spróbuj ponownie.');
  }
}



async function showTask(interaction, options) {
  const taskId = options.getString('taskid');

  if (!taskId) {
    throw new Error('Użycie: /showtask taskid');
  }

  try {
    const row = db.prepare('SELECT * FROM tasks WHERE id = ? AND serverId = ?').get(taskId, interaction.guild.id);

    if (!row) {
      throw new Error('Nie znaleziono zadania o podanym ID na serwerze.');
    }

    await interaction.reply(
      `Szczegóły zadania (ID: ${row.id}):\nData: ${formatDate(row.date)}\nTreść: ${row.content}\nDodatkowe informacje: ${row.additionalInfo}`
    );
  } catch (dbError) {
    console.error('Błąd bazy danych przy pokazywaniu szczegółów zadania:', dbError.message);
    await interaction.reply('Wystąpił błąd podczas pobierania informacji o zadaniu. Spróbuj ponownie.');
  }
}

async function updateTasks() {
  try {
    const rows = db.prepare('SELECT * FROM tasks').all();

    for (const row of rows) {
      const taskDate = new Date(row.date);
      const currentTime = new Date();

      if (taskDate.getTime() <= currentTime.getTime() + 15 * 60 * 1000) {
        const user = await bot.users.fetch(row.userId);
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
      bot.guilds.fetch(serverId).then((guild) => {
        guild.members.fetch(userId).then((user) => {
          user.send(`Przypomnienie: Masz zadanie "${content}" do wykonania za 24 godziny!`);
        });
      });
    }, oneDayBefore.getTime() - Date.now());

    await setTimeout(() => {
      bot.guilds.fetch(serverId).then((guild) => {
        guild.members.fetch(userId).then((user) => {
          user.send(`Przypomnienie: Masz zadanie "${content}" do wykonania za 1 godzinę!`);
        });
      });
    }, oneHourBefore.getTime() - Date.now());
  } catch (error) {
    console.error('Błąd podczas ustawiania przypomnień:', error.message);
  }
}

async function clearTasks(interaction) {
  try {
    db.prepare('DELETE FROM tasks WHERE serverId = ?').run(interaction.guild.id);
    await interaction.reply('Wszystkie zadania na serwerze zostały usunięte.');
  } catch (dbError) {
    console.error('Błąd bazy danych przy usuwaniu zadań:', dbError.message);
    await interaction.reply('Wystąpił błąd podczas usuwania zadań. Spróbuj ponownie.');
  }
}





