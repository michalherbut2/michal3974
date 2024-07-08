const betterSqlite3 = require("better-sqlite3");
const { SlashCommandBuilder } = require("discord.js");
const getNick = require("../../../functions/members/getNick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nb")
    .setDescription("Pokazuje nieobeczności adminów kiszonki!"),
  async execute(interaction) {
    const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);

    const rows = db.prepare("SELECT * FROM inactivity").all();

    let index = 1;
    let mes = "```Lista nieobecnośći (7 nieobecności utrata admina):";
    for (const row of rows) {
      console.log(row);
      console.log(row.user_id);
      mes += `\n${index++}. ${(await getNick(interaction, row.user_id)).padEnd(
        21
      )} - ${row.inactivity_num} nieobecności`;
    }

    db.close();
    await interaction.reply(mes + "```");
  },
};

// };
