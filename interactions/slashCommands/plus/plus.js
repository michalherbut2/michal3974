const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const addRole = require("../../../functions/members/addRole");
const { createSimpleEmbed } = require("../../../functions/messages/createEmbed");
const sendEmbed = require("../../../functions/messages/sendEmbed");

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
    .setDescription("Powód plusa, co zrobił")
    .setRequired(true);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plus")
    .setDescription("Dodaje plusy użytkownikowi")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
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
        .setDescription("Wyczyść wszystkie plusy użytkownika")
        .addUserOption(userField)
    ),

  async execute(interaction) {
    try {
      const subCommand = interaction.options.getSubcommand();
      const targetUser = interaction.options.getUser("uzytkownik");

      if (!targetUser) {
        return await interaction.reply({
          content: "Nie można znaleźć podanego użytkownika.",
          ephemeral: true,
        });
      }

      const guildId = interaction.guild.id;
      const config = interaction.client.config.get(guildId);
      const pointRole = config.rola_za_punkty;
      const db = new betterSqlite3(`db/db_${guildId}.db`);

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
          await interaction.reply({
            content: "Nieznane polecenie!",
            ephemeral: true,
          });
          break;
      }

      db.close();
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'plus':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas wykonywania polecenia.",
        ephemeral: true,
      });
    }
  },
};

async function addPlus(interaction, userId, db, pointRole) {
  try {
    const plusNumToAdd = interaction.options.getInteger("liczba_plusow");
    const reason = interaction.options.getString("powod");
    const plusNum = await getPlus(userId, db);
    const totalPlusNum = plusNum + plusNumToAdd;

    if (totalPlusNum >= 10) {
      addRole(interaction, userId, pointRole);
    }

    db.prepare(
      plusNum
        ? `UPDATE plus SET plus_num = ?, reason = reason || ', ' || ? WHERE user_id = ?`
        : "INSERT INTO plus (plus_num, reason, user_id) VALUES (?, ?, ?)"
    ).run(totalPlusNum, reason, userId);

    const content = `<@${userId}> dostał **${plusNumToAdd}** plusy dodatnie za: **${reason}**! Razem ma **${totalPlusNum}** plusy.`;
    await interaction.reply({
      content: `<@${userId}>`,
      embeds: [createSimpleEmbed(content)],
    });
  } catch (error) {
    console.error("Błąd podczas dodawania plusa:", error);
    await sendEmbed(interaction, {
      description: "Wystąpił błąd podczas dodawania plusa.",
      ephemeral: true,
    });
  }
}

async function removePlus(interaction, userId, db) {
  try {
    const plusNumToRemove = interaction.options.getInteger("liczba_plusow");
    const reason = interaction.options.getString("powod");
    const plusNum = await getPlus(userId, db);
    const totalPlusNum = plusNum - plusNumToRemove;

    db.prepare(
      plusNum
        ? "UPDATE plus SET plus_num = ?, reason = reason || ', ' || ? WHERE user_id = ?"
        : "INSERT INTO plus (plus_num, reason, user_id) VALUES (?, ?, ?)"
    ).run(totalPlusNum, reason, userId);

    const content = `<@${userId}> dostał **${plusNumToRemove}** plusy ujemne za: **${reason}**! Razem ma **${totalPlusNum}** plusy.`;

    await interaction.reply({
      content: `<@${userId}>`,
      embeds: [createSimpleEmbed(content)],
    });
  } catch (error) {
    console.error("Błąd podczas usuwania plusa:", error);
    await sendEmbed(interaction, {
      description: "Wystąpił błąd podczas usuwania plusa.",
      ephemeral: true,
    });
  }
}

async function clearPlus(interaction, userId, db) {
  try {
    db.prepare("DELETE FROM plus WHERE user_id = ?").run(userId);

    const content = `Wyczyszczono wszystkie plusy dla <@${userId}>.`;
    await interaction.reply({
      content: `<@${userId}>`,
      embeds: [createSimpleEmbed(content)],
    });
  } catch (error) {
    console.error("Błąd podczas czyszczenia plusów:", error);
    await sendEmbed(interaction, {
      description: "Wystąpił błąd podczas czyszczenia plusów.",
      ephemeral: true,
    });
  }
}

async function getPlus(userId, db) {
  const result = db.prepare("SELECT plus_num FROM plus WHERE user_id = ?").get(userId);
  return result?.plus_num || 0;
}