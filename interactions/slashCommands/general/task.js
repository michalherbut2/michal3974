const betterSqlite3 = require("better-sqlite3");
const { SlashCommandBuilder } = require("discord.js");
const {
  createSimpleEmbed,
  replyEmbed,
  replyWarningEmbed,
  replySimpleEmbed,
} = require("../../../functions/messages/createEmbed");

// Funkcja do inicjalizacji bazy danych i tabeli
function initializeDatabase(guildId) {
  const db = new betterSqlite3(`db/db_${guildId}.db`);
  db.prepare(`
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      additional_info TEXT
    )
  `).run();
  db.close();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Zarządzaj zadaniami na serwerze")
    .addSubcommand(subcommand =>
      subcommand
        .setName("dodaj")
        .setDescription("Dodaj zadanie")
        .addStringOption(option =>
          option
            .setName("data")
            .setDescription("dzień.miesiąc.rok np. 11.01.2024")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("tresc")
            .setDescription("Treść zadania")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("info")
            .setDescription("Dodatkowe info")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand.setName("poka").setDescription("Wyświetl zadania")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("poka_wszystkie")
        .setDescription("Wyświetl wszystkie zadania")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("szczegoly")
        .setDescription("Wyświetl szczegóły zadania")
        .addStringOption(option =>
          option.setName("id").setDescription("ID zadania").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("usun")
        .setDescription("Usuń zadanie")
        .addStringOption(option =>
          option.setName("id").setDescription("ID zadania").setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand.setName("update").setDescription("Zaktualizuj wszystkie zadania")
    )
    .addSubcommand(subcommand =>
      subcommand.setName("czysc").setDescription("Usuń wszystkie zadania na serwerze")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const db = new betterSqlite3(`db/db_${guildId}.db`);
    initializeDatabase(guildId);

    try {
      switch (subcommand) {
        case "dodaj":
          await addTask(interaction, db);
          break;
        case "poka":
          await listTasks(interaction, db);
          break;
        case "poka_wszystkie":
          await listAllTasks(interaction, db);
          break;
        case "szczegoly":
          await showTask(interaction, db);
          break;
        case "usun":
          await removeTask(interaction, db);
          break;
        case "update":
          await updateTasks(interaction, db);
          break;
        case "czysc":
          await clearTasks(interaction, db);
          break;
      }
    } catch (error) {
      console.error("Error executing command:", error);
      replyWarningEmbed(interaction, `Wystąpił problem: ${error.message}`);
    } finally {
      db.close();
    }
  },
};

async function addTask(interaction, db) {
  const date = interaction.options.getString("data");
  const content = interaction.options.getString("tresc");
  const additionalInfo = interaction.options.getString("info");

  if (!date || !content || !additionalInfo) {
    throw new Error(
      "Użycie: !addtask <data wykonania> <treść zadania> <dodatkowe informacje>"
    );
  }

  const dateFormat =
    /^(0?[1-9]|[12][0-9]|3[01])[.,-/\\ ](0?[1-9]|1[012])[.,-/\\ ]20[2-9]\d$/;

  if (!dateFormat.test(date)) {
    throw new Error("Zła data: poprawny format daty: 01.01.2024");
  }

  try {
    db.prepare(
      "INSERT INTO task (user_id, date, content, additional_info) VALUES (?, ?, ?, ?)"
    ).run(interaction.user.id, date, content, additionalInfo);

    replySimpleEmbed(interaction, "Zadanie zostało dodane pomyślnie!");
    await setReminders(interaction, date, content);
  } catch (dbError) {
    console.error("Błąd bazy danych przy dodawaniu zadania:", dbError);
    throw new Error("Błąd bazy danych: " + dbError.message);
  }
}

async function listTasks(interaction, db) {
  try {
    const rows = db.prepare("SELECT id, date, content FROM task WHERE user_id = ?").all(interaction.user.id);

    if (rows.length === 0) {
      return replySimpleEmbed(interaction, "Brak zaplanowanych zadań.");
    }

    const taskList = rows.map(row => `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`).join("\n");
    replyEmbed(interaction, "Lista zadań", taskList);
  } catch (dbError) {
    console.error("Błąd bazy danych przy listowaniu zadań:", dbError);
    throw new Error("Wystąpił błąd podczas pobierania listy zadań: " + dbError.message);
  }
}

async function listAllTasks(interaction, db) {
  try {
    const rows = db.prepare("SELECT id, date, content FROM task").all();

    if (rows.length === 0) {
      return replySimpleEmbed(interaction, "Brak zaplanowanych zadań na serwerze.");
    }

    const taskList = rows.map(row => `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`).join("\n");
    replyEmbed(interaction, "Lista wszystkich zadań na serwerze", taskList);
  } catch (dbError) {
    console.error("Błąd bazy danych przy listowaniu wszystkich zadań:", dbError);
    throw new Error("Wystąpił błąd podczas pobierania listy zadań: " + dbError.message);
  }
}

async function showTask(interaction, db) {
  const taskId = interaction.options.getString("id");

  if (!taskId) {
    throw new Error("Użycie: !showtask <ID zadania>");
  }

  try {
    const row = db.prepare("SELECT * FROM task WHERE id = ?").get(taskId);

    if (!row) {
      throw new Error("Nie znaleziono zadania o podanym ID na serwerze.");
    }

    replyEmbed(
      interaction,
      `Szczegóły zadania (ID: **${row.id}**):`,
      `Data: **${formatDate(row.date)}**\nTreść: **${row.content}**\nDodatkowe informacje: **${row.additional_info}**`
    );
  } catch (dbError) {
    console.error("Błąd bazy danych przy pokazywaniu szczegółów zadania:", dbError);
    throw new Error("Wystąpił błąd podczas pobierania informacji o zadaniu: " + dbError.message);
  }
}

async function removeTask(interaction, db) {
  const taskId = interaction.options.getString("id");

  if (!taskId) {
    throw new Error("Użycie: !removetask <ID zadania>");
  }

  try {
    const result = db.prepare("DELETE FROM task WHERE id = ?").run(taskId);

    if (result.changes === 0) {
      throw new Error("Nie znaleziono zadania o podanym ID na serwerze.");
    }

    replySimpleEmbed(interaction, "Zadanie zostało usunięte pomyślnie.");
  } catch (dbError) {
    console.error("Błąd bazy danych przy usuwaniu zadania:", dbError);
    replyWarningEmbed(interaction, "Wystąpił błąd podczas usuwania zadania: " + dbError.message);
  }
}

async function updateTasks(interaction, db) {
  try {
    const rows = db.prepare("SELECT * FROM task").all();

    for (const row of rows) {
      const taskDate = new Date(row.date);
      const currentTime = new Date();

      if (taskDate.getTime() <= currentTime.getTime() + 15 * 60 * 1000) {
        const user = await interaction.client.users.fetch(row.user_id);
        user.send(
          `Przypomnienie: Masz zadanie "${row.content}" do wykonania w ciągu 15 minut! Dodatkowe informacje: ${row.additional_info}`
        );
      }
    }

    replySimpleEmbed(interaction, "Zadania zaktualizowane!");
  } catch (dbError) {
    console.error("Błąd bazy danych przy aktualizacji zadań:", dbError);
    throw new Error("Błąd bazy danych: " + dbError.message);
  }
}

async function setReminders(interaction, date, content) {
  const serverId = interaction.guild.id;
  const userId = interaction.user.id;
  const client = interaction.client;

  try {
    const taskDate = new Date(date);
    const oneDayBefore = new Date(taskDate.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(taskDate.getTime() - 60 * 60 * 1000);

    setTimeout(() => {
      client.guilds.fetch(serverId).then(guild => {
        guild.members.fetch(userId).then(user => {
          user.send(
            `Przypomnienie: Masz zadanie "${content}" do wykonania za 24 godziny!`
          );
        });
      });
    }, oneDayBefore.getTime() - Date.now());

    setTimeout(() => {
      client.guilds.fetch(serverId).then(guild => {
        guild.members.fetch(userId).then(user => {
          user.send(
            `Przypomnienie: Masz zadanie "${content}" do wykonania za 1 godzinę!`
          );
        });
      });
    }, oneHourBefore.getTime() - Date.now());
  } catch (error) {
    console.error("Błąd podczas ustawiania przypomnień:", error.message);
  }
}

async function clearTasks(interaction, db) {
  try {
    db.prepare("DELETE FROM task").run();
    replySimpleEmbed(interaction, "Wszystkie zadania usunięte!");
  } catch (dbError) {
    console.error("Błąd bazy danych przy usuwaniu zadań:", dbError);
    replyWarningEmbed(interaction, "Wystąpił błąd podczas usuwania zadań: " + dbError.message);
  }
}

function formatDate(dateString) {
  dateString = dateString
    .split(/[\.,-/ ]/)
    .reverse()
    .join("-");
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return `<t:${new Date(dateString).getTime() / 1000}:D>`;
}