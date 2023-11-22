const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const addRole = require("../../computings/addRole");
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
    )
    .addStringOption(option =>
      option
        .setName("powód")
        .setDescription("Podów plusa, co zrobił")
        .setRequired(true)
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id
    const config = interaction.client.config.get(guildId)
    // const db = betterSqlite3("plusy.db");
    const db = new betterSqlite3(`db/db_${guildId}.db`);

    let plusesNum = interaction.options.getString("liczba_plusow");
    const mentionedUser = interaction.options.getUser("uzytkownik");
    const reason = interaction.options.getString("powód");

    if (!mentionedUser)
      return interaction.reply("Nie można znaleźć podanego użytkownika.");

    const userId = mentionedUser.id;
    let isSet = false;

    // Sprawdź, czy plusesNum zaczyna się od "="
    if (plusesNum.startsWith("=")) {
      plusesNum = +plusesNum.slice(1);
      isSet = true;
    } else plusesNum = +plusesNum;

    // Sprawdź, czy użytkownik już istnieje w bazie danych
    const row = db
      .prepare("SELECT plus_num,reason FROM plus WHERE user_id = ?")
      .get(userId);
    // console.log(row?.reason);
    const existingPluses = row ? row.plus_num : 0;

    // Dodaj plusy do istniejącej liczby lub utwórz nowy wpis
    const totalPluses = isSet ? plusesNum : existingPluses + plusesNum;

    if (totalPluses >= 10) addRole(interaction, userId, config.rola_za_punkty);

    db.prepare(
      row
        ? `UPDATE plus SET plus_num = $totalPluses, reason = reason || ', ${reason}' WHERE user_id = $userId`
        : "INSERT INTO plus (plus_num, user_id, reason) VALUES ($totalPluses, $userId, $reason)"
    ).run({ totalPluses, userId, reason });

    db.close();

    interaction.reply(
      `<@${userId}> dostał ${plusesNum} plus(y) za: **${reason}**.`
    );
  },
};
