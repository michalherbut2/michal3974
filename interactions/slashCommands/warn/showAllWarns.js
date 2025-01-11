const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const {
  createWarningEmbed,
  createEmbed,
} = require("../../../functions/messages/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_wszystkie_ostrzezenia")
    .setDescription("Wyświetl listę ostrzeżeń dla wszystkich użytkowników"),
  async execute(interaction) {
    try {
      const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);
      await showAllWarns(interaction, db);
      db.close();
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'poka_wszystkie_ostrzezenia':", error);
      await interaction.reply({
        embeds: [createWarningEmbed("Wystąpił błąd podczas wyświetlania ostrzeżeń.")],
        ephemeral: true,
      });
    }
  },
};

async function showAllWarns(interaction, db) {
  try {
    const allWarns = await getAllWarns(db);
    if (allWarns.length === 0) {
      return await interaction.reply({
        embeds: [createWarningEmbed("Brak danych o ostrzeżeniach w bazie.")],
      });
    }

    let text = "";
    let id = 1;
    for (const { user_id: userId, warn_num: warnNum, reason } of allWarns) {
      text += `\n**${id++}**. <@${userId}> - \`${warnNum}\` za: **${reason}** ${
        warnNum === 3 ? "**Potem ban**" : ""
      }`;
    }

    await interaction.reply({ embeds: [createEmbed("Wszystkie ostrzeżenia:", text)] });
  } catch (error) {
    console.error("Błąd podczas pobierania ostrzeżeń:", error);
    await interaction.reply({
      embeds: [createWarningEmbed("Wystąpił błąd podczas pobierania ostrzeżeń.")],
      ephemeral: true,
    });
  }
}

async function getAllWarns(db) {
  return db.prepare("SELECT * FROM warn").all();
}