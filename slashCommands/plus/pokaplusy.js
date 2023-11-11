const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const getNick = require("../../computings/getNick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_plusy")
    .setDescription("Wyświetla ilość plusów dla użytkownika")
    .addUserOption(option =>
      option
        .setName("uzytkownik")
        .setDescription(
          "Użytkownik, dla którego chcesz wyświetlić ilość plusów"
        )
    ),
  async execute(interaction) {
    const db = betterSqlite3("plusy.db");

    const mentionedUser =
      interaction.options.getUser("uzytkownik") || interaction.user;

    const userId = mentionedUser.id;
    
    const row = db
      .prepare("SELECT pluses FROM pluses WHERE userId = ?")
      .get(userId);
    
    db.close();
    
    const userPluses = row ? row.pluses : 0;
    interaction.reply(`${await getNick(interaction, userId)} ma ${userPluses} plusów!`);
  },
};
