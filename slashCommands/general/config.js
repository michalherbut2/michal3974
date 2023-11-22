const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const loadConfig = require("../../computings/loadConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Ustawia role jak ma dawać bot za ostrzerzenia")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
    .addChannelOption(option =>
      option
        .setName("kanal_do_komend")
        .setDescription("kanał tekstowy do pisania komend")
        .setRequired(true)
  )
    .addRoleOption(option =>
      option
        .setName("aktywna_rola")
        .setDescription("rola, która zostanie zabrana po tygodniu nieobecności")
        .setRequired(true)
  )
    .addRoleOption(option =>
      option
        .setName("rola_za_punkty")
        .setDescription("rola, która zostanie nadaza za 10 punktów")
        .setRequired(true)
  )
  ,
  async execute(interaction) {
    const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);
    await interaction.reply("Zmieniono konfigurację!");
    updateSettings(interaction,db);
    db.close()
  },
};

async function updateSettings(interaction, db) {
  const warnRole1 = interaction.options.getRole('rola_za_1_ostrzerzenie');
  const warnRole2 = interaction.options.getRole('rola_za_2_ostrzerzenie');
  const warnRole3 = interaction.options.getRole('rola_za_3_ostrzerzenie');
  const commandChannel = interaction.options.getChannel("kanal_do_komend");
  const activeRole = interaction.options.getRole("aktywna_rola");
  const pointRole = interaction.options.getRole("rola_za_punkty");
  // console.log(commandChannel.id);
  const updateQuery = "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)"
  db.prepare(updateQuery).run('rola_za_1_ostrzerzenie', warnRole1.id)
  db.prepare(updateQuery).run('rola_za_2_ostrzerzenie', warnRole2.id)
  db.prepare(updateQuery).run('rola_za_3_ostrzerzenie', warnRole3.id)
  db.prepare(updateQuery).run("kanal_do_komend", commandChannel.id);
  db.prepare(updateQuery).run("aktywna_rola", activeRole.id);
  db.prepare(updateQuery).run("rola_za_punkty", pointRole.id);
  loadConfig(interaction.client)
}