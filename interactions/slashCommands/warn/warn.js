const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Colors,
} = require("discord.js");
const addRole = require("../../../functions/members/addRole");
const removeRole = require("../../../functions/members/removeRole");
const betterSqlite3 = require("better-sqlite3");
// const {
//   createEmbed,
//   createSimpleEmbed,
//   createWarningEmbed,
// } = require("../../../functions/messages/createEmbed");
const sendEmbed = require("../../../functions/messages/sendEmbed");

const warningEmoji = "<a:uwaga:1175724533076992081>";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ostrzezenie")
    .setDescription("Zarządzaj ostrzeżeniami użytkowników")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName("dodaj")
        .setDescription("Dodaj ostrzeżenie dla użytkownika")
        .addUserOption(option =>
          option
            .setName("uzytkownik")
            .setDescription("Użytkownik, któremu chcesz dodać ostrzeżenie")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("powod")
            .setDescription("Powód ostrzerzenia")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("usun")
        .setDescription("Usuń ostatnie ostrzeżenie dla użytkownika")
        .addUserOption(option =>
          option
            .setName("uzytkownik")
            .setDescription(
              "Użytkownik, któremu chcesz usunąć ostatnie ostrzeżenie"
            )
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("czysc")
        .setDescription("Wyczyść wszystkie ostrzeżenia dla użytkownika")
        .addUserOption(option =>
          option
            .setName("uzytkownik")
            .setDescription(
              "Użytkownik, dla którego chcesz wyczyścić ostrzeżenia"
            )
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser("uzytkownik");
    const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);

    switch (subCommand) {
      case "dodaj":
        await addWarn(interaction, targetUser.id, db);
        break;
      case "usun":
        await removeWarn(interaction, targetUser.id, db);
        break;
      case "czysc":
        await clearWarns(interaction, targetUser.id, db);
        break;
      default:
        sendEmbed(interaction, {
          description: "Nieznane polecenie!",
          color: Colors.Red,
        });
        // interaction.reply({
        //   embeds: [createWarningEmbed("Nieznane polecenie!")],
        // });
        break;
    }
    db.close();
  },
};

async function addWarn(interaction, userId, db) {
  const reason = interaction.options.getString("powod");
  const guildId = interaction.guild.id;
  const config = interaction.client.config.get(guildId);
  const {
    rola_za_1_ostrzerzenie: warnRole1,
    rola_za_2_ostrzerzenie: warnRole2,
    rola_za_3_ostrzerzenie: warnRole3,
    rola_zakaz_pisania: writingBanRole,
    rola_zakaz_gadania: speakingBanRole,
  } = config;
  let warnNum = await getWarns(userId, db);

  const sql = warnNum++
    ? `UPDATE warn SET warn_num = warn_num + 1, reason = reason || ', ' || ? WHERE user_id = ?`
    : "INSERT INTO warn (reason, user_id) VALUES (?, ?)";

  await db.prepare(sql).run(reason, userId);

  const text = `<@${userId}> nareszcie dostał ${warnNum}. ostrzerzenie za **${reason}**!${
    warnNum === 3 ? "\n# Potem ban" : ""
  }`;

  let content = text + "\n";
  if (warnRole1) {
    if (warnNum == 1) {
      await addRole(interaction, userId, warnRole1);
      await addRole(interaction, userId, writingBanRole);
      content += `W nagrodę <@${userId}> przez dzień nie możesz pisać!`;
      setTimeout(() => {
        removeRole(interaction, userId, writingBanRole);
      }, 1000 * 60 * 60 * 24); // dzień
    } else if (warnNum == 2) {
      await addRole(interaction, userId, warnRole2);
      await addRole(interaction, userId, writingBanRole);
      await addRole(interaction, userId, speakingBanRole);

      content += `W nagrodę <@${userId}> przez 3 dni nie możesz pisać i gadać!`;
      setTimeout(() => {
        removeRole(interaction, userId, writingBanRole);
        removeRole(interaction, userId, speakingBanRole);
      }, 1000 * 60 * 60 * 24 * 3);
    } else if (warnNum == 3) {
      await addRole(interaction, userId, warnRole3);
      await addRole(interaction, userId, writingBanRole);
      await addRole(interaction, userId, speakingBanRole);
      content += `W nagrodę <@${userId}> przez tydzień nie możesz pisać i gadać!`;
      setTimeout(() => {
        removeRole(interaction, userId, writingBanRole);
        removeRole(interaction, userId, speakingBanRole);
      }, 1000 * 60 * 60 * 24 * 7);
    } else
      content += `W nagrodę za Twoje zasługi <@${userId}> otrzymujesz banicję`;
  }

  sendEmbed(interaction, {
    content: `<@${userId}>`,
    title: `${warningEmoji} Ostrzeżenie! ${warningEmoji}`,
    description: content,
    color: Colors.Red,
  });
  // interaction.reply({
  //   content: `<@${userId}>`,
  //   embeds: [
  //     createEmbed(
  //       `${warningEmoji} Ostrzeżenie! ${warningEmoji}`,
  //       content,
  //       0xff2200
  //     ),
  //   ],
  // });
}

async function removeWarn(interaction, userId, db) {
  await db
    .prepare(
      "UPDATE warn SET warn_num = CASE WHEN warn_num > 0 THEN warn_num - 1 ELSE 0 END WHERE user_id = ?"
    )
    .run(userId);

  const warnNum = await getWarns(userId, db);
  const description = `Usunięto ostatnie ostrzeżenie dla <@${userId}>. Razem ma teraz ${warnNum} ostrzeżeń.`;
  sendEmbed(interaction, { content: `<@${userId}>`, description });
  // interaction.reply({
  //   content: `<@${userId}>`,
  //   embeds: [createSimpleEmbed(content)],
  // });
}

async function clearWarns(interaction, userId, db) {
  await db.prepare("DELETE FROM warn WHERE user_id = ?").run(userId);
  const description = `Wyczyszczono wszystkie ostrzeżenia dla <@${userId}>.`;
  sendEmbed(interaction, { content: `<@${userId}>`, description });

  // interaction.reply({
  //   content: `<@${userId}>`,
  //   embeds: [createSimpleEmbed(content)],
  // });
}

async function getWarns(userId, db) {
  const result = await db
    .prepare("SELECT warn_num FROM warn WHERE user_id = ?")
    .get(userId);
  return result?.warn_num || 0;
}
