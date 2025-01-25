const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const checkInactivity = require("../../../functions/time/checkInactivity");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sprawdzaj_nieobecnosci")
    .setDescription("Zliczanie nieobecności osób z daną rangą i usuwanie rangi po tygodniu nieobecności")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand(subcommand =>
      subcommand
        .setName("wlacz")
        .setDescription("Włącz sprawdzanie nieobecności")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("wylacz")
        .setDescription("Wyłącz sprawdzanie nieobecności")
    ),
  async execute(interaction) {
    try {
      const subCommand = interaction.options.getSubcommand();

      switch (subCommand) {
        case "wlacz":
          await turnOnChecking(interaction);
          break;
        case "wylacz":
          await turnOffChecking(interaction);
          break;
        default:
          await interaction.reply({ content: "Nieznane polecenie!", ephemeral: true });
          break;
      }
    } catch (error) {
      console.error("Error executing command:", error);
      await interaction.reply({ content: `Wystąpił błąd: ${error.message}`, ephemeral: true });
    }
  },
};

async function turnOnChecking(interaction) {
  try {
    const intervalInMilliseconds = 86_400_000; // 1 day
    const guildID = interaction.guild.id;

    const interval = setInterval(
      () => checkInactivity(interaction.client, guildID),
      intervalInMilliseconds
    );

    interaction.client.inactivity.set(guildID, interval);
    await interaction.reply("Sprawdzanie nieobecności włączone!");
  } catch (error) {
    console.error("Error turning on inactivity checking:", error);
    await interaction.reply({ content: `Wystąpił błąd przy włączaniu sprawdzania nieobecności: ${error.message}`, ephemeral: true });
  }
}

async function turnOffChecking(interaction) {
  try {
    const guildID = interaction.guild.id;
    const interval = interaction.client.inactivity.get(guildID);

    if (interval) {
      clearInterval(interval);
      interaction.client.inactivity.delete(guildID);
      await interaction.reply("Sprawdzanie nieobecności wyłączone!");
    } else {
      await interaction.reply({ content: "Sprawdzanie nieobecności nie było włączone.", ephemeral: true });
    }
  } catch (error) {
    console.error("Error turning off inactivity checking:", error);
    await interaction.reply({ content: `Wystąpił błąd przy wyłączaniu sprawdzania nieobecności: ${error.message}`, ephemeral: true });
  }
}