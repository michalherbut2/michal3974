const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const getNick = require("../../computings/getNick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top_plusy")
    .setDescription(
      "Wyświetla top 10 użytkowników z największą ilością plusów"
    ),
  async execute(interaction) {
    const db = betterSqlite3("plusy.db");

    const rows = db
      .prepare(
        "SELECT userId, pluses FROM pluses ORDER BY pluses DESC LIMIT 10"
      )
      .all();
    db.close();
    if (rows.length === 0) {
      return interaction.reply("Brak danych o plusach w bazie.");
    }

    let topUsers = "Top 10 użytkowników z największą ilością plusów:\n";

    const result = (
      await Promise.all(
        rows.map(
          async (row, index) =>
            `${index + 1}. ${await getNick(interaction, row.userId)} - ${
              row.pluses
            } plusów`
        )
      )
    ).join("\n");

    interaction.reply(topUsers + result);
  },
};
