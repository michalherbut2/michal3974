const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
// const sqlite = require("sqlite3");
const addRole = require("../../computings/addRole");
const removeRole = require("../../computings/removeRole");
const betterSqlite3 = require("better-sqlite3");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ostrzezenie")
    .setDescription("Zarządzaj ostrzeżeniami użytkowników")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName("dodaj")
        .setDescription("Dodaj ostrzeżenie dla użytkownika")
        .addUserOption(option =>
          option
            .setName("uzytkownik")
            .setDescription("Użytkownik, któremu chcesz dodać ostrzeżenie")
            .setRequired(true)
        )
    )
    .addSubcommand(
      subcommand =>
        subcommand
          .setName("usun")
          .setDescription("Usuń ostatnie ostrzeżenie dla użytkownika")
          .addUserOption(option =>
            option
              .setName("uzytkownik")
              .setDescription(
                "Użytkownik, któremu chcesz usunąć ostatnie ostrzeżenie"
              )
              .setRequired(true)
          )
      // .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    )
    // .addSubcommand(subcommand =>
    //   subcommand
    //     .setName("lista")
    //     .setDescription("Wyświetl listę ostrzeżeń dla użytkownika")
    //     .addUserOption(option =>
    //       option
    //         .setName("uzytkownik")
    //         .setDescription(
    //           "Użytkownik, dla którego chcesz wyświetlić ostrzeżenia"
    //         )
    //         .setRequired(true)
    //     )
    // )
    .addSubcommand(
      subcommand =>
        subcommand
          .setName("czysc")
          .setDescription("Wyczyść wszystkie ostrzeżenia dla użytkownika")
          .addUserOption(option =>
            option
              .setName("uzytkownik")
              .setDescription(
                "Użytkownik, dla którego chcesz wyczyścić ostrzeżenia"
              )
              .setRequired(true)
          )
      // .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    ),
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser("uzytkownik");
    const db = new betterSqlite3("./warns.db");

    switch (subCommand) {
      case "dodaj":
        await dodajOstrzezenie(interaction, targetUser.id, db);
        break;
      case "usun":
        await usunOstrzezenie(interaction, targetUser.id, db);
        break;
      // case "lista":
      //   await wyswietlListeOstrzezen(interaction, targetUser.id, db);
      //   break;
      case "czysc":
        await wyczyscOstrzezenia(interaction, targetUser.id, db);
        break;
      default:
        interaction.reply("Nieznane polecenie!");
        break;
    }
    db.close();
  },
};

async function dodajOstrzezenie(interaction, userId, db) {
  // const db = new sqlite.Database("./warns.db");
  
  // const db = await sqlite.open("./baza.db");
  await db
    .prepare("INSERT OR IGNORE INTO ostrzezenia (userId) VALUES (?)")
    .run(userId);
  await db
    .prepare("UPDATE ostrzezenia SET warnings = warnings + 1 WHERE userId = ?")
    .run(userId);

  const iloscOstrzezen = await pobierzListeOstrzezen(userId, db);
  const text = `Dodano ostrzeżenie dla <@${userId}>. Razem ma teraz ${iloscOstrzezen} ostrzeżeń.${
    iloscOstrzezen === 3 ? "\n# Potem ban" : ""
  }`;

  // await interaction.reply(text);

  if (iloscOstrzezen == 1) {
    const result = await addRole(interaction, userId, "1172068282849824809");
    // interaction.followUp(
    interaction.reply(
      `${text}\n${result}\nW nagrodę <@${userId}> przez dzień nie możesz pisać`
    );
    setTimeout(() => {
      removeRole(interaction, userId, "1172068282849824809");
    }, 1000 * 60 * 60 * 24); // dzień
    // }, 10_000);
  } else if (iloscOstrzezen == 2) {
    const result = await addRole(interaction, userId, "1172068461288104000");
    // interaction.followUp(
    interaction.reply(
      `${text}\n${result}\nW nagrodę <@${userId}> przez 3 dni nie możesz pisać i gadać`
    );
    setTimeout(() => {
      removeRole(interaction, userId, "1172068461288104000");
    }, 1000 * 60 * 60 * 24 * 3);
    // }, 10_000);
  } else if (iloscOstrzezen == 3) {
    const result = await addRole(interaction, userId, "1172679953452630096");
    // interaction.followUp(
    interaction.reply(
      `${text}\n${result}\nW nagrodę <@${userId}> przez tydzień nie możesz pisać i gadać`
    );
    setTimeout(() => {
      removeRole(interaction, userId, "1172679953452630096");
    }, 1000 * 60 * 60 * 24 * 7);
    // }, 10_000);
  }
}

async function usunOstrzezenie(interaction, userId, db) {
  await db
    .prepare(
      "UPDATE ostrzezenia SET warnings = CASE WHEN warnings > 0 THEN warnings - 1 ELSE 0 END WHERE userId = ?"
    )
    .run(userId);

  const iloscOstrzezen = await pobierzListeOstrzezen(userId, db);
  interaction.reply(
    `Usunięto ostatnie ostrzeżenie dla <@${userId}>. Razem ma teraz ${iloscOstrzezen} ostrzeżeń.`
  );
}

// async function wyswietlListeOstrzezen(interaction, userId, db) {
//   const iloscOstrzezen = await pobierzListeOstrzezen(userId, db);
//   interaction.reply(
//     `Ostrzeżenia dla <@${userId}>: ${iloscOstrzezen}${
//       iloscOstrzezen === 3 ? "\n# Potem ban" : ""
//     }`
//   );
// }

async function wyczyscOstrzezenia(interaction, userId, db) {
  await db.prepare("DELETE FROM ostrzezenia WHERE userId = ?").run(userId);

  interaction.reply(`Wyczyszczono wszystkie ostrzeżenia dla <@${userId}>.`);
}

async function pobierzListeOstrzezen(userId, db) {
  const result = await db
    .prepare("SELECT warnings FROM ostrzezenia WHERE userId = ?")
    .get(userId);
  console.log(result);
  return result?.warnings || 0;
}
