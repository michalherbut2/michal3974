const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const loadConfig = require("../../computings/loadConfig");
const { replyEmbed } = require("../../computings/createEmbed");
const getConfig = require("../../computings/getConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Ustawia role jak ma dawać bot za ostrzerzenia")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName("ustaw")
        .setDescription("zastąpi starą konfigurację przez nodo podane dane")
        .addRoleOption(option =>
          option
            .setName("rola_za_1_ostrzerzenie")
            .setDescription("rola za 1 ostrzerzenie")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_za_2_ostrzerzenie")
            .setDescription("rola za 2 ostrzerzenie")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_za_3_ostrzerzenie")
            .setDescription("rola za 3 ostrzerzenie")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_zakaz_pisania")
            .setDescription("rola, która nie pozwala pisać na kanałach tekstowych")
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_zakaz_gadania")
            .setDescription("rola, która nie pozwala gadać na kanałach głosowych")
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName("kanal_do_komend")
            .setDescription("kanał tekstowy do pisania komend")
            .setRequired(true)
        )
        .addChannelOption(option =>
          option
            .setName("kanal_do_kar")
            .setDescription(
              "kanał tekstowy do powiadamiania o banach czy przerwach"
            )
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("aktywna_rola")
            .setDescription(
              "rola, która zostanie zabrana po tygodniu nieobecności"
            )
            .setRequired(true)
        )
        .addRoleOption(option =>
          option
            .setName("rola_za_punkty")
            .setDescription("rola, która zostanie nadaza za 10 punktów")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand.setName("poka").setDescription("pokazuje konfigurację")
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const db = new betterSqlite3(`db/db_${guildId}.db`);
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "ustaw":
          await updateSettings(interaction, db);
          await interaction.reply("Zmieniono konfigurację!");
          break;
        case "poka":
          await showSettings(interaction, db);
          break;
      }
    } catch (error) {
      console.error(error);
      replyWarningEmbed(interaction, error.message);
    }
    db.close();
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
  // console.log(commandChannel.id);
  const updateQuery =
    "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)";
  db.prepare(updateQuery).run("rola_za_1_ostrzerzenie", warnRole1.id);
  db.prepare(updateQuery).run("rola_za_2_ostrzerzenie", warnRole2.id);
  db.prepare(updateQuery).run("rola_za_3_ostrzerzenie", warnRole3.id);
  db.prepare(updateQuery).run("rola_zakaz_pisania", writingBanRole.id);
  db.prepare(updateQuery).run("rola_zakaz_gadania", speakingBanRole.id);
  db.prepare(updateQuery).run("kanal_do_komend", commandChannel.id);
  db.prepare(updateQuery).run("kanal_do_kar", logChannel.id);
  db.prepare(updateQuery).run("aktywna_rola", activeRole.id);
  db.prepare(updateQuery).run("rola_za_punkty", pointRole.id);
  loadConfig(interaction.client);
}

async function showSettings(interaction, db) {
  const config = await getConfig(db);
  console.log(config);
  let message = "";
  for (const key in config) message += `${key}: <${key.match(/rola/)?'@&':'#'}${config[key]}>\n`;
  replyEmbed(interaction, "Konfiguracja bota", message)
}