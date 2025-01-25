const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const loadConfig = require("../../../functions/settings/loadConfig");
const sendEmbed = require("../../../functions/messages/sendEmbed");
const getConfig = require("../../../functions/settings/getConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Ustawia role jak ma dawać bot za ostrzerzenia")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName("ustaw")
        .setDescription("Zastępuje starą konfigurację przez nowo podane dane")
        .addRoleOption(option =>
          option
            .setName("rola_za_1_ostrzerzenie")
            .setDescription("Rola za 1 ostrzerzenie")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_za_2_ostrzerzenie")
            .setDescription("Rola za 2 ostrzerzenie")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_za_3_ostrzerzenie")
            .setDescription("Rola za 3 ostrzerzenie")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_zakaz_pisania")
            .setDescription("Rola, która nie pozwala pisać na kanałach tekstowych")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_zakaz_gadania")
            .setDescription("Rola, która nie pozwala gadać na kanałach głosowych")
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName("kanal_do_komend")
            .setDescription("Kanał tekstowy do pisania komend")
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName("kanal_do_kar")
            .setDescription("Kanał tekstowy do powiadamiania o banach czy przerwach")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("aktywna_rola")
            .setDescription("Rola, która zostanie zabrana po tygodniu nieobecności")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_za_punkty")
            .setDescription("Rola, która zostanie nadana za 10 punktów")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand.setName("zmien").setDescription("Zmienia jedną opcję")
        .addStringOption(option =>
          option
            .setName("opcja")
            .setDescription("Opcja, którą chcesz zmienić")
            .setRequired(true)
            .addChoices(
              { name: "rola_za_1_ostrzerzenie", value: "rola_za_1_ostrzerzenie" },
              { name: "rola_za_2_ostrzerzenie", value: "rola_za_2_ostrzerzenie" },
              { name: "rola_za_3_ostrzerzenie", value: "rola_za_3_ostrzerzenie" },
              { name: "rola_zakaz_pisania", value: "rola_zakaz_pisania" },
              { name: "rola_zakaz_gadania", value: "rola_zakaz_gadania" },
              { name: "kanal_do_komend", value: "kanal_do_komend" },
              { name: "kanal_do_kar", value: "kanal_do_kar" },
              { name: "aktywna_rola", value: "aktywna_rola" },
              { name: "rola_za_punkty", value: "rola_za_punkty" }
            )
        )
        .addRoleOption(option =>
          option
            .setName("nowa_rola")
            .setDescription("Nowa rola do przypisania")
            .setRequired(false)
        )
        .addChannelOption(option =>
          option
            .setName("nowy_kanal")
            .setDescription("Nowy kanał do przypisania")
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand.setName("poka").setDescription("Pokazuje konfigurację")
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const db = new betterSqlite3(`db/db_${guildId}.db`);

    // Ensure the config table exists
    db.prepare(`CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`).run();

    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "ustaw":
          await updateSettings(interaction, db);
          await interaction.reply("Zmieniono konfigurację!");
          break;
        case "zmien":
          await updateSingleSetting(interaction, db);
          await interaction.reply("Zmieniono pojedynczą opcję konfiguracji!");
          break;
        case "poka":
          await showSettings(interaction, db);
          break;
      }
    } catch (error) {
      console.error("Error executing config command:", error);
      await sendErrorEmbed(interaction, error.message);
    } finally {
      db.close();
    }
  },
};

async function updateSettings(interaction, db) {
  const warnRole1 = interaction.options.getRole("rola_za_1_ostrzerzenie");
  const warnRole2 = interaction.options.getRole("rola_za_2_ostrzerzenie");
  const warnRole3 = interaction.options.getRole("rola_za_3_ostrzerzenie");
  const writingBanRole = interaction.options.getRole("rola_zakaz_pisania");
  const speakingBanRole = interaction.options.getRole("rola_zakaz_gadania");
  const commandChannel = interaction.options.getChannel("kanal_do_komend");
  const logChannel = interaction.options.getChannel("kanal_do_kar");
  const activeRole = interaction.options.getRole("aktywna_rola");
  const pointRole = interaction.options.getRole("rola_za_punkty");

  const updateQuery = "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)";
  const stmt = db.prepare(updateQuery);

  db.transaction(() => {
    stmt.run("rola_za_1_ostrzerzenie", warnRole1.id);
    stmt.run("rola_za_2_ostrzerzenie", warnRole2.id);
    stmt.run("rola_za_3_ostrzerzenie", warnRole3.id);
    stmt.run("rola_zakaz_pisania", writingBanRole.id);
    stmt.run("rola_zakaz_gadania", speakingBanRole.id);
    stmt.run("kanal_do_komend", commandChannel.id);
    stmt.run("kanal_do_kar", logChannel.id);
    stmt.run("aktywna_rola", activeRole.id);
    stmt.run("rola_za_punkty", pointRole.id);
  })();

  loadConfig(interaction.client);
}

async function updateSingleSetting(interaction, db) {
  const option = interaction.options.getString("opcja");
  const newRole = interaction.options.getRole("nowa_rola");
  const newChannel = interaction.options.getChannel("nowy_kanal");

  if (!newRole && !newChannel) {
    throw new Error("Nie podano żadnej nowej roli ani kanału.");
  }

  const updateQuery = "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)";
  const stmt = db.prepare(updateQuery);

  if (newRole) {
    stmt.run(option, newRole.id);
  } else if (newChannel) {
    stmt.run(option, newChannel.id);
  }
}

async function showSettings(interaction, db) {
  const config = await getConfig(db);
  let description = "";
  for (const key in config) {
    description += `${key}: <${key.match(/rola/) ? "@&" : "#"}${config[key]}>\n`;
  }

  if (!description) {
    description = "Nie skonfigurowano bota, wpisz: `/config ustaw`";
  }

  await sendEmbed(interaction, { title: "Konfiguracja bota", description });
}

async function sendErrorEmbed(interaction, errorMessage) {
  await sendEmbed(interaction, {
    description: `Wystąpił błąd: ${errorMessage}`,
    ephemeral: true,
    color: "red",
  });
}