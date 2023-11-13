const betterSqlite3 = require("better-sqlite3");
const { SlashCommandBuilder } = require("discord.js");
const getNick = require("../../computings/getNick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nb")
    .setDescription("Pokazuje nieobeczności adminów kiszonki!"),
  async execute(interaction) {
    const db = new betterSqlite3("./user_activity.db");
    const rows = db.prepare("SELECT * FROM users").all();

    let index = 1;
    let mes = "Lista nieobecnośći (7 nieobecności utrata admina):";
    for (const row of rows) {
      mes += `\n${index++}. ${await getNick(interaction, row.user_id)} - ${
        row.inactivity_days
      } nieobecności`;
    }

    db.close();
    await interaction.reply(mes);
  },
};

// };
