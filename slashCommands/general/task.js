const betterSqlite3 = require("better-sqlite3");
const { SlashCommandBuilder } = require('discord.js');

// db.prepare(`
//   CREATE TABLE IF NOT EXISTS task (
//     id INTEGER PRIMARY KEY,
//     serverId TEXT,
//     userId TEXT,
//     date TEXT,
//     content TEXT,
//     additionalInfo TEXT
//   )
// `).run();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('task')
    .setDescription('Zarządzaj zadaniami na serwerze')
    .addSubcommand(subcommand =>
      subcommand
        .setName('dodaj')
        .setDescription('Dodaj zadanie')
        .addStringOption(option =>
          option
            .setName('data')
            .setDescription('rok-miesiąc-dzień np. 2023-12-24')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('tresc')
            .setDescription('Treść zadania')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('info')
            .setDescription('Dodatkowe info')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('poka')
        .setDescription('Wyświetl zadania')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('poka_wszystkie')
        .setDescription('Wyświetl wszystkie zadania')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('szczegoly')
        .setDescription('Wyświetl szczegóły zadania')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('ID zadania')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('usun')
        .setDescription('Usuń zadanie')
        .addStringOption(option =>
          option
            .setName('id')
            .setDescription('ID zadania')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('update')
        .setDescription('Update all tasks')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('czysc')
        .setDescription('Usuń wszystkie zadania na serwerze')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    const guildId = interaction.guild.id;
    const db = new betterSqlite3(`db/db_${guildId}.db`);

    // db.prepare('DROP TABLE task').run()

    try {
      switch (subcommand) {
        case 'dodaj':
          await addTask(interaction, db);
          break;
        case 'poka':
          await listTasks(interaction, db);
          break;
        case 'poka_wszystkie':
          await listAllTasks(interaction, db);
          break;
        case 'szczegoly':
          await showTask(interaction, db);
          break;
        case 'usun':
          await removeTask(interaction, db);
          break;
        case 'update':
          await updateTasks(interaction, db);
          break;
        case 'czysc':
          await clearTasks(interaction, db);
          break;
      }
    } catch (error) {
      console.error(error);
      interaction.reply('Wystąpił problem! ' + error.message);
    }
    db.close();
  },
};

// setInterval(updateTasks, 15 * 60 * 1000);

async function addTask(interaction, db) {
  const date = interaction.options.getString('data');
  const content = interaction.options.getString('tresc');
  const additionalInfo = interaction.options.getString('info');

  if (!date || !content || !additionalInfo) {
    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Dodawania Zadania')
      .setDescription('Użycie: `/task dodaj --data <data wykonania> --tresc <treść zadania> --info <dodatkowe informacje>`');

    throw new Error({ embeds: [errorEmbed] });
  }

  try {
    await db.prepare('INSERT INTO task (user_id, date, content, additional_info) VALUES (?, ?, ?, ?)').run(
      interaction.user.id,
      date,
      content,
      additionalInfo,
    );

    const successEmbed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Zadanie Dodane Pomyślnie')
      .setDescription('Zadanie zostało dodane pomyślnie!');

    interaction.reply({ embeds: [successEmbed] });
    await setReminders(interaction, date, content);
  } catch (dbError) {
    console.error('Błąd bazy danych przy dodawaniu zadania:', dbError);

    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Dodawania Zadania')
      .setDescription('Wystąpił błąd podczas dodawania zadania: ' + dbError.message);

    interaction.reply({ embeds: [errorEmbed] });
  }
}


async function listTasks(interaction, db) {
  try {
    const rows = await db.prepare('SELECT id, date, content FROM task WHERE user_id = ?').all(interaction.user.id);

    if (rows.length === 0) {
      return interaction.reply('Brak zaplanowanych zadań.');
    }

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Lista Zadań')
      .setDescription('Oto lista Twoich zadań:');

    rows.forEach((row) => {
      embed.addField(`ID: ${row.id}`, `Data: ${formatDate(row.date)}\nTreść: ${row.content}`);
    });

    interaction.reply({ embeds: [embed] });
  } catch (dbError) {
    console.error('Błąd bazy danych przy listowaniu zadań:', dbError);
    interaction.reply('Wystąpił błąd podczas pobierania listy zadań: ' + dbError.message);
  }
}
async function listAllTasks(interaction, db) {
  try {
    const rows = await db.prepare('SELECT id, date, content FROM task').all();

    if (rows.length === 0) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Brak Zadań')
        .setDescription('Brak zaplanowanych zadań na serwerze.');

      return interaction.reply({ embeds: [embed] });
    }

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Lista Wszystkich Zadań na Serwerze')
      .setDescription('Oto lista wszystkich zadań na serwerze:');

    rows.forEach((row) => {
      embed.addField(`ID: ${row.id}`, `Data: ${formatDate(row.date)}\nTreść: ${row.content}`);
    });

    interaction.reply({ embeds: [embed] });
  } catch (dbError) {
    console.error('Błąd bazy danych przy listowaniu wszystkich zadań:', dbError);

    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Bazy Danych')
      .setDescription('Wystąpił błąd podczas pobierania listy zadań: ' + dbError.message);

    interaction.reply({ embeds: [errorEmbed] });
  }
}


async function showTask(interaction, db) {
  const taskId = interaction.options.getString('id');

  if (!taskId) {
    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Wyświetlania Zadania')
      .setDescription('Użycie: `/task szczegoly --id <ID zadania>`');

    throw new Error({ embeds: [errorEmbed] });
  }

  try {
    const row = await db.prepare('SELECT * FROM task WHERE id = ?').get(taskId);

    if (!row) {
      const notFoundEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Nie Znaleziono Zadania')
        .setDescription('Nie znaleziono zadania o podanym ID na serwerze.');

      throw new Error({ embeds: [notFoundEmbed] });
    }

    const taskEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Szczegóły Zadania (ID: ${row.id})`)
      .setDescription(`Data: ${formatDate(row.date)}\nTreść: ${row.content}\nDodatkowe informacje: ${row.additional_info}`);

    interaction.reply({ embeds: [taskEmbed] });
  } catch (dbError) {
    console.error('Błąd bazy danych przy pokazywaniu szczegółów zadania:', dbError);

    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Wyświetlania Zadania')
      .setDescription('Wystąpił błąd podczas pobierania informacji o zadaniu: ' + dbError.message);

    interaction.reply({ embeds: [errorEmbed] });
  }
}

async function removeTask(interaction, db) {
  const taskId = interaction.options.getString('id');

  if (!taskId) {
    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Usuwania Zadania')
      .setDescription('Użycie: `/task usun --id <ID zadania>`');

    throw new Error({ embeds: [errorEmbed] });
  }

  try {
    const result = await db.prepare('DELETE FROM task WHERE id = ?').run(taskId);

    if (result.changes === 0) {
      const notFoundEmbed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Nie Znaleziono Zadania')
        .setDescription('Nie znaleziono zadania o podanym ID na serwerze.');

      throw new Error({ embeds: [notFoundEmbed] });
    }

    const successEmbed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Zadanie Usunięte Pomyślnie')
      .setDescription('Zadanie zostało usunięte pomyślnie.');

    interaction.reply({ embeds: [successEmbed] });
  } catch (dbError) {
    console.error('Błąd bazy danych przy usuwaniu zadania:', dbError);

    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Usuwania Zadania')
      .setDescription('Wystąpił błąd podczas usuwania zadania: ' + dbError.message);

    interaction.reply({ embeds: [errorEmbed] });
  }
}


async function updateTasks(interaction, db) {
  try {
    const rows = await db.prepare('SELECT * FROM task').all();

    const reminders = [];

    for (const row of rows) {
      const taskDate = new Date(row.date);
      const currentTime = new Date();

      if (taskDate.getTime() <= currentTime.getTime() + 15 * 60 * 1000) {
        const user = await interaction.client.users.fetch(row.user_id);

        reminders.push({
          userId: user.id,
          content: row.content,
          additionalInfo: row.additional_info,
        });
      }
    }

    if (reminders.length > 0) {
      const reminderEmbed = new MessageEmbed()
        .setColor('#ffcc00')
        .setTitle('Przypomnienia o Zadaniach')
        .setDescription('Oto przypomnienia o zadaniach do wykonania w ciągu 15 minut:');

      reminders.forEach((reminder) => {
        reminderEmbed.addField(
          `Użytkownik: ${reminder.userId}`,
          `Zadanie: "${reminder.content}"\nDodatkowe informacje: ${reminder.additionalInfo}`
        );
      });

      interaction.reply({ embeds: [reminderEmbed] });
    } else {
      interaction.reply('Brak zadań do wykonania w ciągu 15 minut.');
    }
  } catch (dbError) {
    console.error('Błąd bazy danych przy aktualizacji zadań:', dbError);

    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Aktualizacji Zadań')
      .setDescription('Wystąpił błąd podczas aktualizacji zadań: ' + dbError.message);

    interaction.reply({ embeds: [errorEmbed] });
  }
}


async function setReminders(interaction, date, content) {
  const serverId = interaction.guild.id
  const userId = interaction.user.id
  const client = interaction.client
  try {
    const taskDate = new Date(date);
    const oneDayBefore = new Date(taskDate.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(taskDate.getTime() - 60 * 60 * 1000);

async function setReminders(interaction, date, content) {
  const serverId = interaction.guild.id;
  const userId = interaction.user.id;
  const client = interaction.client;

  try {
    const taskDate = new Date(date);
    const oneDayBefore = new Date(taskDate.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(taskDate.getTime() - 60 * 60 * 1000);

    await setTimeout(() => {
      client.guilds.fetch(serverId).then(guild => {
        guild.members.fetch(userId).then(user => {
          const reminderEmbed = new MessageEmbed()
            .setColor('#ffcc00')
            .setTitle('Przypomnienie o Zadaniu')
            .setDescription(`Masz zadanie "${content}" do wykonania za 24 godziny!`);

          user.send({ embeds: [reminderEmbed] });
        });
      });
    }, oneDayBefore.getTime() - Date.now());

    await setTimeout(() => {
      client.guilds.fetch(serverId).then((guild) => {
        guild.members.fetch(userId).then((user) => {
          const reminderEmbed = new MessageEmbed()
            .setColor('#ffcc00')
            .setTitle('Przypomnienie o Zadaniu')
            .setDescription(`Masz zadanie "${content}" do wykonania za 1 godzinę!`);

          user.send({ embeds: [reminderEmbed] });
        });
      });
    }, oneHourBefore.getTime() - Date.now());
  } catch (error) {
    console.error('Błąd podczas ustawiania przypomnień:', error.message);
  }
}


async function clearTasks(interaction, db) {
  try {
    await db.prepare('DELETE FROM task').run();

    const successEmbed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Wyczyszczono Zadania')
      .setDescription('Wszystkie zadania zostały usunięte pomyślnie!');

    interaction.reply({ embeds: [successEmbed] });
  } catch (dbError) {
    console.error('Błąd bazy danych przy usuwaniu zadań:', dbError);

    const errorEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Błąd Usuwania Zadań')
      .setDescription('Wystąpił błąd podczas usuwania zadań: ' + dbError.message);

    interaction.reply({ embeds: [errorEmbed] });
  }
}


function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    timeZoneName: 'short' 
  };

  const formattedDate = new Date(dateString).toLocaleDateString('pl-PL', options);
  return formattedDate;
}
