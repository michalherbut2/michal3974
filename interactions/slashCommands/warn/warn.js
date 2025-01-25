const { SlashCommandBuilder, PermissionFlagsBits, Colors } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const addRole = require("../../../functions/members/addRole");
const removeRole = require("../../../functions/members/removeRole");
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

    try {
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
          await sendEmbed(interaction, {
            description: "Nieznane polecenie!",
            color: Colors.Red,
          });
          break;
      }
    } catch (error) {
      console.error(`Błąd podczas wykonywania komendy 'ostrzezenie': ${error}`);
      await sendEmbed(interaction, {
        description: "Wystąpił błąd podczas wykonywania komendy.",
        color: Colors.Red,
        ephemeral: true,
      });
    } finally {
      db.close();
    }
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

  const sql = warnNum
    ? `UPDATE warn SET warn_num = warn_num + 1, reason = reason || ', ' || ? WHERE user_id = ?`
    : "INSERT INTO warn (reason, user_id) VALUES (?, ?)";

  db.prepare(sql).run(reason, userId);
  warnNum++;

  let content = `<@${userId}> nareszcie dostał ${warnNum}. ostrzerzenie za **${reason}**!${
    warnNum === 3 ? "\n# Potem ban" : ""
  }\n`;

  if (warnRole1) {
    if (warnNum == 1) {
      await handleRoleAssignment(interaction, userId, warnRole1, writingBanRole, 1, content);
    } else if (warnNum == 2) {
      await handleRoleAssignment(interaction, userId, warnRole2, [writingBanRole, speakingBanRole], 3, content);
    } else if (warnNum == 3) {
      await handleRoleAssignment(interaction, userId, warnRole3, [writingBanRole, speakingBanRole], 7, content);
    } else {
      content += `W nagrodę za Twoje zasługi <@${userId}> otrzymujesz banicję`;
    }
  }

  await sendEmbed(interaction, {
    content: `<@${userId}>`,
    title: `${warningEmoji} Ostrzeżenie! ${warningEmoji}`,
    description: content,
    color: Colors.Red,
  });
}

async function handleRoleAssignment(interaction, userId, warnRole, banRoles, days, content) {
  await addRole(interaction, userId, warnRole);
  if (Array.isArray(banRoles)) {
    for (const banRole of banRoles) {
      await addRole(interaction, userId, banRole);
    }
  } else {
    await addRole(interaction, userId, banRoles);
  }

  content += `W nagrodę <@${userId}> przez ${days} ${days === 1 ? 'dzień' : 'dni'} nie możesz pisać${Array.isArray(banRoles) ? ' i gadać' : ''}!`;
  setTimeout(() => {
    if (Array.isArray(banRoles)) {
      for (const banRole of banRoles) {
        removeRole(interaction, userId, banRole);
      }
    } else {
      removeRole(interaction, userId, banRoles);
    }
  }, 1000 * 60 * 60 * 24 * days);
}

async function removeWarn(interaction, userId, db) {
  db.prepare(
    "UPDATE warn SET warn_num = CASE WHEN warn_num > 0 THEN warn_num - 1 ELSE 0 END WHERE user_id = ?"
  ).run(userId);

  const warnNum = await getWarns(userId, db);
  const description = `Usunięto ostatnie ostrzeżenie dla <@${userId}>. Razem ma teraz ${warnNum} ostrzeżeń.`;
  await sendEmbed(interaction, { content: `<@${userId}>`, description });
}

async function clearWarns(interaction, userId, db) {
  db.prepare("DELETE FROM warn WHERE user_id = ?").run(userId);
  const description = `Wyczyszczono wszystkie ostrzeżenia dla <@${userId}>.`;
  await sendEmbed(interaction, { content: `<@${userId}>`, description });
}

async function getWarns(userId, db) {
  const result = db.prepare("SELECT warn_num FROM warn WHERE user_id = ?").get(userId);
  return result?.warn_num || 0;
}