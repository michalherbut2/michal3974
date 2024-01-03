const { parse, isValid } = require("date-fns");
const betterSqlite3 = require("better-sqlite3");
const { SlashCommandBuilder } = require("discord.js");
const {
  createSimpleEmbed,
  replyEmbed,
  replyWarningEmbed,
  replySimpleEmbed,
} = require("../../computings/createEmbed");

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
            .setDescription("rok-miesiąc-dzień np. 2023-12-24 lub inne obsługiwane")
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
      subcommand.setName("update").setDescription("Update all tasks")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("czysc")
        .setDescription("Usuń wszystkie zadania na serwerze")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    const guildId = interaction.guild.id;
    const db = new betterSqlite3(`db/db_${guildId}.db`);

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
      console.error(error);
      // interaction.reply("Wystąpił problem! " + error.message);
      replyWarningEmbed(interaction, error.message);
    }
    db.close();
  },
};

// setInterval(updateTasks, 15 * 60 * 1000);



async function addTask(interaction, db) {
  const dateInput = interaction.options.getString("data");
  const content = interaction.options.getString("tresc");
  const additionalInfo = interaction.options.getString("info");

  if (!dateInput || !content || !additionalInfo)
    throw new Error(
      "Użycie: /task dodaj <data wykonania> <treść zadania> <dodatkowe informacje>"
    );

  try {
    const parsedDate = parseDate(dateInput);

    await db
      .prepare(
        "INSERT INTO task (user_id, date, content, additional_info) VALUES (?, ?, ?, ?)"
      )
      .run(interaction.user.id, parsedDate.toISOString(), content, additionalInfo);

    replySimpleEmbed(interaction, `Zadanie zostało dodane pomyślnie!`);
    await setReminders(interaction, parsedDate, content);
  } catch (dbError) {
    console.error("Błąd bazy danych przy dodawaniu zadania: " + dbError);
    throw new Error(dbError.message);
  } catch (dateError) {
    console.error("Błąd podczas parsowania daty: " + dateError);
    throw new Error(dateError.message);
  }
}

function parseDate(dateString) {
  // Zdefiniuj tablicę możliwych formatów daty
  const dateFormats = [
    "dd.MM.yyyy",
    "dd-MM-yyyy",
    "d-M-yyyy",
    "d-M-yy",
    "dd-MM-yy",
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "MM-dd-yyyy",
    "M-d-yyyy",
    "M-d-yy",
    "MM-dd-yy",
    "yy-MM-dd",
    "yyyy/MM/dd",
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", // Rozszerzony format ISO 8601
  ];

  // Spróbuj sparsować datę dla każdego formatu, aż jeden sukcesywnie się powiedzie
  for (const format of dateFormats) {
    try {
      const parsedDate = parse(dateString, format, new Date());
      
      // Sprawdź, czy sparsowana data jest ważna
      if (isValid(parsedDate)) {
        // Zwróć pierwszą poprawnie sparsowaną i ważną datę
        return parsedDate;
      }
    } catch (error) {
      // Kontynuuj do następnego formatu, jeśli parsowanie nie powiedzie się
    }
  }

  // Jeśli żaden z formatów nie powiedzie się, zgłoś błąd
  throw new Error("Nieprawidłowy format daty. Dostępne formaty to: dd.MM.yyyy, dd-MM-yyyy, d-M-yyyy, d-M-yy, dd-MM-yy, yyyy-MM-dd, MM/dd/yyyy, MM-dd-yyyy, M-d-yyyy, M-d-yy, MM-dd-yy, yy-MM-dd, yyyy/MM/dd, yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
}

async function listTasks(interaction, db) {
  try {
    // console.log(interaction);
    const rows = await db
      .prepare("SELECT id, date, content FROM task WHERE user_id = ?")
      .all(interaction.user.id);

    if (rows.length === 0)
      return replySimpleEmbed(interaction, "Brak zaplanowanych zadań.");
    // return interaction.reply({
    //   embeds: [createSimpleEmbed("Brak zaplanowanych zadań.")],
    // });

    // console.log(rows);
    const taskList = rows.map(
      row =>
        `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`
    );
    // interaction.reply(`Lista zadań:\n${taskList.join("\n")}`);
    replyEmbed(interaction, "Lista zadań", taskList.join("\n"));
  } catch (dbError) {
    console.error("Błąd bazy danych przy listowaniu zadań:" + dbError);
    throw new Error(
      "Wystąpił błąd podczas pobierania listy zadań: " + dbError.message
    );
    // interaction.reply(
    //   "Wystąpił błąd podczas pobierania listy zadań: " + dbError.message
    // );
  }
}

async function listAllTasks(interaction, db) {
  try {
    const rows = await db.prepare("SELECT id, date, content FROM task").all();

    if (rows.length === 0)
      return replySimpleEmbed(
        interaction,
        "Brak zaplanowanych zadań na serwerze."
      );
    // return interaction.reply("Brak zaplanowanych zadań na serwerze.");

    const taskList = rows.map(
      row =>
        `ID: ${row.id}, Data: ${formatDate(row.date)}, Treść: ${row.content}`
    );
    // interaction.reply(
    //   `Lista wszystkich zadań na serwerze:\n${taskList.join("\n")}`
    // );
    replyEmbed(
      interaction,
      "Lista wszystkich zadań na serwerze",
      taskList.join("\n")
    );
  } catch (dbError) {
    console.error(
      "Błąd bazy danych przy listowaniu wszystkich zadań: " + dbError
    );
    // interaction.reply(
    //   "Wystąpił błąd podczas pobierania listy zadań: " + dbError.message
    // );
    throw new Error(
      "Wystąpił błąd podczas pobierania listy zadań: " + dbError.message
    );
  }
}

async function showTask(interaction, db) {
  const taskId = interaction.options.getString("id");

  if (!taskId) throw new Error("Użycie: !showtask <ID zadania>");

  try {
    const row = await db.prepare("SELECT * FROM task WHERE id = ?").get(taskId);

    if (!row)
      throw new Error("Nie znaleziono zadania o podanym ID na serwerze.");
    // console.log(row);
    // interaction.reply(
    //   `Szczegóły zadania (ID: ${row.id}):\nData: ${formatDate(
    //     row.date
    //   )}\nTreść: ${row.content}\nDodatkowe informacje: ${row.additional_info}`
    // );
    replyEmbed(
      interaction,
      `Szczegóły zadania (ID: **${row.id}**):`,
      `Data: **${formatDate(row.date)}**\nTreść: **${
        row.content
      }**\nDodatkowe informacje: **${row.additional_info}**`
    );
  } catch (dbError) {
    console.error(
      "Błąd bazy danych przy pokazywaniu szczegółów zadania: " +
      dbError
    );
    // interaction.reply(
      // "Wystąpił błąd podczas pobierania informacji o zadaniu: " +
      //   dbError.message
    // );
    throw new Error("Wystąpił błąd podczas pobierania informacji o zadaniu: " +
    dbError.message)
  }
}

async function removeTask(interaction, db) {
  const taskId = interaction.options.getString("id");

  if (!taskId) throw new Error("Użycie: !removetask <ID zadania>");

  try {
    const result = await db
      .prepare("DELETE FROM task WHERE id = ?")
      .run(taskId);

    if (result.changes === 0)
      throw new Error("Nie znaleziono zadania o podanym ID na serwerze.");

    // interaction.reply("Zadanie zostało usunięte pomyślnie.");
    replySimpleEmbed(interaction, "Zadanie zostało usunięte pomyślnie.")
  } catch (dbError) {
    console.error("Błąd bazy danych przy usuwaniu zadania: " + dbError);
    // interaction.reply(
    //   "Wystąpił błąd podczas usuwania zadania: " + dbError.message
    // );
    replyWarningEmbed(interaction, "Wystąpił błąd podczas usuwania zadania: " + dbError.message)
  }
}

async function updateTasks(interaction, db) {
  try {
    const rows = await db.prepare("SELECT * FROM task").all();

    for (const row of rows) {
      const taskDate = new Date(row.date);
      const currentTime = new Date();

      if (taskDate.getTime() <= currentTime.getTime() + 15 * 60 * 1000) {
        const user = await interaction.client.users.fetch(row.user_id);
        user.send(
          `Przypomnienie: Masz zadanie "${row.content}" do wykonania w ciągu 15 minut! Dodatkowe informacje: ${row.additional_info}`
        );
        // interaction.reply('Zadania zaktualizowane!');
      }
    }
    // interaction.reply("Zadania zaktualizowane!");
    replySimpleEmbed(interaction, "Zadania zaktualizowane!")
  } catch (dbError) {
    console.error("Błąd bazy danych przy aktualizacji zadań: " + dbError);
    // interaction.reply(
    //   "Błąd bazy danych przy aktualizacji zadań: " + dbError.message
    // );
    throw new Error("Błąd bazy danych przy aktualizacji zadań: " + dbError)
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

    await setTimeout(() => {
      client.guilds.fetch(serverId).then(guild => {
        guild.members.fetch(userId).then(user => {
          user.send(
            `Przypomnienie: Masz zadanie "${content}" do wykonania za 24 godziny!`
          );
        });
      });
    }, oneDayBefore.getTime() - Date.now());

    await setTimeout(() => {
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
    await db.prepare("DELETE FROM task").run();
    interaction.reply("Wszystkie zadania usunięte!");
  } catch (dbError) {
    console.error("Błąd bazy danych przy usuwaniu zadań:", dbError);
    // interaction.reply(
    //   "Wystąpił błąd podczas usuwania zadań: " + dbError.message
    // );
  }
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "numeric",
    // minute: "numeric",
    // second: "numeric",
    // timeZoneName: "short",
  };
  console.log(dateString);
  const formattedDate = new Date(dateString).toLocaleDateString(
    "pl-PL",
    options
  );
  return `<t:${new Date(dateString).getTime() / 1000}:D>`;
  return formattedDate;
}
