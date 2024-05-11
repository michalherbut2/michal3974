const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const addRole = require("../../computings/addRole");
const { createSimpleEmbed } = require("../../computings/createEmbed");

const plusNumField = option =>
  option
    .setName("liczba_plusow")
    .setDescription("Liczba plusów do dodania")
    .setRequired(true);

const userField = option =>
  option
    .setName("uzytkownik")
    .setDescription("Użytkownik, któremu chcesz dodać plusy")
    .setRequired(true);

const reasonField = option =>
  option
    .setName("powod")
    .setDescription("Podów plusa, co zrobił")
    .setRequired(true);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plus")
    .setDescription("Dodaje plusy użytkownikowi")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    // .addStringOption(plusNumField)
    // .addUserOption(userField)
    // .addStringOption(reasonField)
    .addSubcommand(subcommand =>
      subcommand
        .setName("dodatni")
        .setDescription("Daj dodatniego plusa użytkownikowi")
        .addIntegerOption(plusNumField)
        .addUserOption(userField)
        .addStringOption(reasonField)
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("ujemny")
        .setDescription("Daj ujemnego plusa użytkownikowi")
        .addIntegerOption(plusNumField)
        .addUserOption(userField)
        .addStringOption(reasonField)
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("czysc")
        .setDescription("Wyczyść wszystkie plus użytkownika")
        .addUserOption(userField)
    ),
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser("uzytkownik");

    const guildId = interaction.guild.id;
    const config = interaction.client.config.get(guildId);
    const pointRole = config.rola_za_punkty;
    const db = new betterSqlite3(`db/db_${guildId}.db`);

    if (!targetUser)
      return interaction.reply("Nie można znaleźć podanego użytkownika.");

    const userId = targetUser.id;

    switch (subCommand) {
      case "dodatni":
        await addPlus(interaction, userId, db, pointRole);
        break;
      case "ujemny":
        await removePlus(interaction, userId, db);
        break;
      case "czysc":
        await clearPlus(interaction, userId, db);
        break;
      default:
        interaction.reply("Nieznane polecenie!");
        break;
    }
    db.close();
  },
};

async function addPlus(interaction, userId, db, pointRole) {
  const plusNumToAdd = interaction.options.getInteger("liczba_plusow");
  const reason = interaction.options.getString("powod");
  const plusNum = await getPlus(userId, db);
  const totalPlusNum = plusNum + plusNumToAdd;

  console.log(pointRole);

  if (totalPlusNum >= 10) addRole(interaction, userId, pointRole);

  db.prepare(
    plusNum
      ? `UPDATE plus SET plus_num = ?, reason = reason || ', ' || ? WHERE user_id = ?`
      : "INSERT INTO plus (plus_num, reason, user_id) VALUES (?, ?, ?)"
  ).run(totalPlusNum, reason, userId);

  const content = `<@${userId}> dostał **${plusNumToAdd}** plusy dodatnie za: **${reason}**! Razem ma **${totalPlusNum}** plusy.`;
  interaction.reply({
    content: `<@${userId}>`,
    embeds: [createSimpleEmbed(content)],
  });
}

async function removePlus(interaction, userId, db) {
  const plusNumToRemove = interaction.options.getInteger("liczba_plusow");
  const reason = interaction.options.getString("powod");
  const plusNum = await getPlus(userId, db);
  const totalPlusNum = plusNum - plusNumToRemove;

  await db
    .prepare(
      plusNum
        ? "UPDATE plus SET plus_num = ?, reason = reason || ', ' || ? WHERE user_id = ?"
        : "INSERT INTO plus (plus_num, reason, user_id) VALUES (?, ?, ?)"
    )
    .run(totalPlusNum, reason, userId);

  const content = `<@${userId}> dostał **${plusNumToRemove}** plusy ujemne za: **${reason}**! Razem ma **${totalPlusNum}** plusy.`;

  interaction.reply({
    content: `<@${userId}>`,
    embeds: [createSimpleEmbed(content)],
  });
}

async function clearPlus(interaction, userId, db) {
  await db.prepare("DELETE FROM plus WHERE user_id = ?").run(userId);

  const content = `Wyczyszczono wszystkie ostrzeżenia dla <@${userId}>.`;
  interaction.reply({
    content: `<@${userId}>`,
    embeds: [createSimpleEmbed(content)],
  });
}

async function getPlus(userId, db) {
  const result = db
    .prepare("SELECT plus_num FROM plus WHERE user_id = ?")
    .get(userId);
  return result?.plus_num || 0;
}
