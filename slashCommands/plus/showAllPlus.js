const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const getNick = require("../../computings/getNick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_wszystkie_plusy")
    .setDescription("Wyświetla plusy wszystkich użytkowników"),
  async execute(interaction) {
    // const db = betterSqlite3("plusy.db");
    const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);


    const rows = db
      .prepare("SELECT * FROM plus ORDER BY plus_num DESC")
      .all();
    db.close();
    if (rows.length === 0) {
      return interaction.reply("Brak danych o plusach w bazie.");
    }

    let topUsers = "## Wszystkie plusy:\n";

    const result = (
      await Promise.all(
        rows.map(
          async (row, index) =>
            `${index + 1}. ${await getNick(interaction, row.user_id)} - ${
              row.plus_num
            } plusów za: **${row.reason}**`
        )
      )
    ).join("\n");

    interaction.reply(topUsers + result);
  },
};
