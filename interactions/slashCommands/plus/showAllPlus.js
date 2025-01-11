const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const { createEmbed } = require("../../../functions/messages/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_wszystkie_plusy")
    .setDescription("Wyświetla plusy wszystkich użytkowników"),
  async execute(interaction) {
    try {
      const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);

      const rows = db.prepare("SELECT * FROM plus ORDER BY plus_num DESC").all();
      db.close();

      if (rows.length === 0) {
        return await interaction.reply({
          content: "Brak danych o plusach w bazie.",
          ephemeral: true,
        });
      }

      const content = rows
        .map(
          (row, index) =>
            `${index + 1}. <@${row.user_id}>: ${row.plus_num} plusów za: **${
              row.reason
            }**`
        )
        .join("\n");

      await interaction.reply({ embeds: [createEmbed("Wszystkie plusy", content)] });
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'poka_wszystkie_plusy':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas wyświetlania plusów.",
        ephemeral: true,
      });
    }
  },
};