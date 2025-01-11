const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const sendEmbed = require("../../../functions/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("super_turbo_przerwa")
    .setDescription("Banuje użytkownika na 28 dni")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option
        .setName("uzytkownik")
        .setDescription("Kogo zbanować?")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("powod")
        .setDescription("Za co taka sroga kara w postaci przerwy na 28 dni")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, guild } = interaction;

    // Retrieve user and reason from options
    const user = options.getUser("uzytkownik");
    const reason = options.getString("powod");

    // Fetch the guild member
    const member = guild.members.cache.get(user.id);

    try {
      // Ensure the member exists
      if (!member) {
        throw new Error("Nie można znaleźć użytkownika w serwerze.");
      }

      // Timeout the member for 28 days
      await member.timeout(28 * 24 * 60 * 60 * 1000, reason); // 28 days

      // Send success message
      await sendEmbed(interaction, {
        description: `${member} na szczęście dostał bana na 28 dni!`,
      });

      console.log("User has been banned for 28 days.");

    } catch (error) {
      console.error("Error executing super_turbo_przerwa command:", error);

      // Send error message
      await sendEmbed(interaction, {
        description: `Wystąpił błąd: ${error.message}`,
        ephemeral: true,
        color: "red",
      });
    }
  },
};