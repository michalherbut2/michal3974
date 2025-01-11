const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const { createSimpleEmbed } = require("../../../functions/messages/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_ostrzezenia")
    .setDescription("Wyświetl listę ostrzeżeń dla użytkownika")
    .addUserOption(option =>
      option
        .setName("uzytkownik")
        .setDescription("Użytkownik, dla którego chcesz wyświetlić ostrzeżenia")
    ),

  async execute(interaction) {
    try {
      const targetUser =
        interaction.options.getUser("uzytkownik") || interaction.user;
      const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);

      await printWarns(interaction, targetUser.id, db);
      db.close();
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'poka_ostrzezenia':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas wyświetlania ostrzeżeń.",
        ephemeral: true,
      });
    }
  },
};

async function printWarns(interaction, userId, db) {
  try {
    const [warnNum, reason] = await getWarn(userId, db);
    const content = `Ostrzeżenia dla <@${userId}>: ${warnNum} za: **${reason}**${
      warnNum === 3 ? "\n# Potem ban" : ""
    }`;
    await interaction.reply({ embeds: [createSimpleEmbed(content)] });
  } catch (error) {
    console.error("Błąd podczas pobierania ostrzeżeń:", error);
    await interaction.reply({
      content: "Wystąpił błąd podczas pobierania ostrzeżeń.",
      ephemeral: true,
    });
  }
}

async function getWarn(userId, db) {
  const result = db.prepare("SELECT warn_num, reason FROM warn WHERE user_id = ?").get(userId);
  return [result?.warn_num || 0, result?.reason || "nic"];
}