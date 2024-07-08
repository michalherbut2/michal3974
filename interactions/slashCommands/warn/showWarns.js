const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const {
  createSimpleEmbed,
} = require("../../../functions/messages/createEmbed");

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
    const targetUser =
      interaction.options.getUser("uzytkownik") || interaction.member;
    const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);

    await printWarns(interaction, targetUser.id, db);

    db.close();
  },
};

async function printWarns(interaction, userId, db) {
  const [warnNum, reason] = await getWarn(userId, db);
  // const nick = await getNick(interaction, userId);
  const content = `Ostrzeżenia dla <@${userId}>: ${warnNum} za: **${reason}**${
    warnNum === 3 ? "\n# Potem ban" : ""
  }`;
  interaction.reply({ embeds: [createSimpleEmbed(content)] });
}

async function getWarn(userId, db) {
  const result = await db
    .prepare("SELECT warn_num, reason FROM warn WHERE user_id = ?")
    .get(userId);
  return [result?.warn_num || 0, result?.reason || "nic"];
}
