const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const {
  createSimpleEmbed,
} = require("../../../functions/messages/createEmbed");

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
    const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);

    const mentionedUser =
      interaction.options.getUser("uzytkownik") || interaction.user;

    const userId = mentionedUser.id;

    const row = db
      .prepare("SELECT plus_num, reason FROM plus WHERE user_id = ?")
      .get(userId);

    db.close();

    const userPluses = row ? row.plus_num : 0;
    const reason = row ? row.reason : "";
    const content = `<@${userId}> ma ${userPluses} plusów za: **${reason}**!`;
    interaction.reply({ embeds: [createSimpleEmbed(content)] });
  },
};
