const betterSqlite3 = require("better-sqlite3");
const { SlashCommandBuilder } = require("discord.js");
const getNick = require("../../../functions/members/getNick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nb")
    .setDescription("Pokazuje nieobeczności adminów kiszonki!"),
  
  async execute(interaction) {
    const dbPath = `db/db_${interaction.guild.id}.db`;
    let db;

    try {
      // Initialize the database connection
      db = new betterSqlite3(dbPath);

      // Retrieve all rows from the inactivity table
      const rows = db.prepare("SELECT * FROM inactivity").all();

      // Initialize the message with a header
      let index = 1;
      let mes = "```Lista nieobecności (7 nieobecności utrata admina):";

      // Loop through each row and append to the message
      for (const row of rows) {
        console.log(row);
        const nick = await getNick(interaction, row.user_id);
        mes += `\n${index++}. ${nick.padEnd(21)} - ${row.inactivity_num} nieobecności`;
      }

      mes += "```";

      // Reply with the generated message
      await interaction.reply(mes);
    } catch (error) {
      console.error("Error executing nb command:", error);

      // Reply with an error message
      await interaction.reply({
        content: `Wystąpił błąd przy wykonywaniu polecenia: ${error.message}`,
        ephemeral: true,
      });
    } finally {
      // Ensure the database connection is closed
      if (db) {
        db.close();
      }
    }
  },
};