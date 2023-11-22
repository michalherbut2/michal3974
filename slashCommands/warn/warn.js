const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const addRole = require("../../computings/addRole");
const removeRole = require("../../computings/removeRole");
const betterSqlite3 = require("better-sqlite3");

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
    // console.log(interaction.guild.name, interaction.guild.id);
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
        interaction.reply("Nieznane polecenie!");
        break;
    }
    db.close();
  },
};

async function addWarn(interaction, userId, db) {
  const reason = interaction.options.getString("powod");
  const config = await getConfig(db);
  let warnNum = await getWarns(userId, db);

  if (warnNum++)
    await db
      .prepare(
        `UPDATE warn SET warn_num = warn_num + 1, reason = reason || ', ${reason}' WHERE user_id = ?`
      )
      .run(userId);
  else 
    await db
      .prepare("INSERT OR IGNORE INTO warn (user_id, reason) VALUES (?,?)")
      .run(userId, reason);

  const text = `<@${userId}> dostał ostrzerzenie za **${reason}**. Razem ma teraz ${warnNum} ostrzeżeń.${
    warnNum === 3 ? "\n# Potem ban" : ""
  }`;

  if (warnNum == 1 && config?.rola_za_1_ostrzerzenie) {
    await addRole(
      interaction,
      userId,
      config.rola_za_1_ostrzerzenie
    );
    interaction.reply(
      `${text}\nW nagrodę <@${userId}> przez dzień nie możesz pisać`
    );
    setTimeout(() => {
      removeRole(interaction, userId, config?.rola_za_1_ostrzerzenie);
    }, 1000 * 60 * 60 * 24); // dzień
  } else if (warnNum == 2 && config?.rola_za_2_ostrzerzenie) {
    await addRole(
      interaction,
      userId,
      config.rola_za_2_ostrzerzenie
    );
    interaction.reply(
      `${text}\nW nagrodę <@${userId}> przez 3 dni nie możesz pisać i gadać`
    );
    setTimeout(() => {
      removeRole(interaction, userId, config?.rola_za_2_ostrzerzenie);
    }, 1000 * 60 * 60 * 24 * 3);
  } else if (warnNum == 3 && config?.rola_za_3_ostrzerzenie) {
    await addRole(
      interaction,
      userId,
      config.rola_za_3_ostrzerzenie
    );
    interaction.reply(
      `${text}\nW nagrodę <@${userId}> przez tydzień nie możesz pisać i gadać`
    );
    setTimeout(() => {
      removeRole(interaction, userId, config?.rola_za_3_ostrzerzenie);
    }, 1000 * 60 * 60 * 24 * 7);
  } else
    interaction.reply(
      `${text}\nW nagrodę za Twoje zasługi <@${userId}> otrzymujesz banicję`
    );
}

async function removeWarn(interaction, userId, db) {
  await db
    .prepare(
      "UPDATE warn SET warn_num = CASE WHEN warn_num > 0 THEN warn_num - 1 ELSE 0 END WHERE user_id = ?"
    )
    .run(userId);

  const warnNum = await getWarns(userId, db);
  interaction.reply(
    `Usunięto ostatnie ostrzeżenie dla <@${userId}>. Razem ma teraz ${warnNum} ostrzeżeń.`
  );
}

async function clearWarns(interaction, userId, db) {
  await db.prepare("DELETE FROM warn WHERE user_id = ?").run(userId);

  interaction.reply(`Wyczyszczono wszystkie ostrzeżenia dla <@${userId}>.`);
}

async function getWarns(userId, db) {
  const result = await db
    .prepare("SELECT warn_num FROM warn WHERE user_id = ?")
    .get(userId);
  // console.log(result);
  return result?.warn_num || 0;
}

const getServerConfig = async db => await db.prepare("SELECT * FROM config").all();
const getConfig = async db => Object.fromEntries((await getServerConfig(db)).map(item => [item.key, item.value]));
