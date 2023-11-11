const betterSqlite3 = require("better-sqlite3");
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database("./user_activity.db");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nb")
    .setDescription("Pokazuje nieobeczności adminów kiszonki!"),
  async execute(interaction) {

    const db = new betterSqlite3("./warns.db");
    try {
      const rows = db.prepare("SELECT * FROM users").all();
      if (rows.length === 0) {
        await interaction.reply("Brak danych o nieobecnościach w bazie.");
        return;
      }
      let index = 1;
      let mes = "```Lista nieobecnośći (7 nieobecności utrata admina):";
      for (const row of rows) {
        const member = await message.guild.members.fetch(row.user_id);
        const nick = member?.nickname
          ? member.nickname
          : member?.user?.globalName;
        mes += `\n${index++}. ${nick.padEnd(19)} - ${
          row.inactivity_days
        } nieobecności`;
      }

      await interaction.reply(mes + "```");
    } catch(error) {
      console.error("Wystąpił błąd:", error.message);
      await interaction.reply("Wystąpił błąd:", error.message);
    } finally {
      // Zawsze zamykaj połączenie z bazą danych, nawet jeśli wystąpił błąd
      db.close();
    }
  },
};