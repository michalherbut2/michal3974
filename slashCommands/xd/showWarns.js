const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_ostrzezenie")
    .setDescription("Wyświetl listę ostrzeżeń dla użytkownika")
    .addUserOption(option =>
      option
        .setName("uzytkownik")
        .setDescription("Użytkownik, dla którego chcesz wyświetlić ostrzeżenia")
        // .setRequired(true)
    ),
  async execute(interaction) {
    const targetUser =
      interaction.options.getUser("uzytkownik") || interaction.member;
    const db = new betterSqlite3("./warns.db");

    await wyswietlListeOstrzezen(interaction, targetUser.id, db);
   
    db.close();
  },
};

async function wyswietlListeOstrzezen(interaction, userId, db) {
  const iloscOstrzezen = await pobierzListeOstrzezen(userId, db);
    const guildMember = await interaction.guild.members.fetch(userId);
    const nick = guildMember?.displayName;

  interaction.reply(
    `Ostrzeżenia dla ${nick}: ${iloscOstrzezen}${
      iloscOstrzezen === 3 ? "\n# Potem ban" : ""
    }`
  );
}

async function pobierzListeOstrzezen(userId, db) {
  const result = await db
    .prepare("SELECT warnings FROM ostrzezenia WHERE userId = ?")
    .get(userId);
  return result?.warnings || 0;
}
