const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const checkInactivity = require("../../computings/checkInactivity");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sprawdzaj_nieobecnosci")
    .setDescription(
      "zliczanie nieobecności osób z daną rangą i usuwanie rangi po tygodniu nieobecnści"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName("wlacz")
        .setDescription("włącz sprawdzanie nieobecności")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("wylacz")
        .setDescription("wyłącz sprawdzanie nieobecności")
    ),
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "wlacz":
        turnOnChecking(interaction);
        break;
      case "wylacz":
        turnOffChecking(interaction);
        break;
      default:
        interaction.reply("Nieznane polecenie!");
        break;
    }
  },
};
async function turnOnChecking(interaction) {
  const intervalInMilliseconds = 86_400_000; // 1 day
  // const intervalInMilliseconds = 10_000; // 1 day
  const guildID = interaction.guild.id;
  
  const interval = setInterval(
    () => checkInactivity(interaction.client, guildID),
    intervalInMilliseconds
  );  

  interaction.client.inactivity.set(guildID, interval);
  await interaction.reply("Sprawdzanie nieobecności włączone!")
}

async function turnOffChecking(interaction) {
  let interval = await interaction.client.inactivity.get(
    interaction.guild.id
  );
  clearInterval(interval)
  interval=null
  await interaction.reply("Sprawdzanie nieobecności wyłączone!");
}