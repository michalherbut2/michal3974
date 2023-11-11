const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const addRole = require("../../computings/addRole_old");
const getNick = require("../../computings/getNick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plus")
    .setDescription("Dodaje plusy użytkownikowi")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addStringOption(option =>
      option
        .setName("liczba_plusow")
        .setDescription("Liczba plusów do dodania")
        .setRequired(true)
    )
    .addUserOption(option =>
      option
        .setName("uzytkownik")
        .setDescription("Użytkownik, któremu chcesz dodać plusy")
        .setRequired(true)
    ),
  async execute(interaction) {
    const db = betterSqlite3("plusy.db");

    let plusesNum = interaction.options.getString("liczba_plusow");
    const mentionedUser = interaction.options.getUser("uzytkownik");

    if (!mentionedUser)
      return interaction.reply("Nie można znaleźć podanego użytkownika.");

    const userId = mentionedUser.id;
    let isSet = false;

    // Sprawdź, czy plusesNum zaczyna się od "="
    if (plusesNum.startsWith("=")) {
      plusesNum = +plusesNum.slice(1);
      isSet = true;
    } else plusesNum = +plusesNum;

    await db
      .prepare(
        "CREATE TABLE IF NOT EXISTS pluses (userId TEXT, pluses INTEGER)"
      )
      .run();

    // Sprawdź, czy użytkownik już istnieje w bazie danych
    const row = db
      .prepare("SELECT pluses FROM pluses WHERE userId = ?")
      .get(userId);

    const existingPluses = row ? row.pluses : 0;

    // Dodaj plusy do istniejącej liczby lub utwórz nowy wpis
    const totalPluses = isSet ? plusesNum : existingPluses + plusesNum;

    if (totalPluses >= 10) {
      addRole(interaction, userId);
    }

    db.prepare(
      row
        ? "UPDATE pluses SET pluses = $totalPluses WHERE userId = $userId"
        : "INSERT INTO pluses (pluses, userId) VALUES ($totalPluses, $userId)"
    ).run({ totalPluses, userId });

    db.close();

    interaction.reply(
      `${plusesNum} plus(y) zostały dodane dla użytkownika <@${userId}>.`
    );
  },
};
