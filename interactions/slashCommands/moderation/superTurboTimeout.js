const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const sendEmbed = require("../../../functions/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("super_turbo_przerwa")
    .setDescription("banuje np. Patryka na 28 dni")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option =>
      option
        .setName("uzytkownik")
        .setDescription("Kogo zbanowwać?")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("powod")
        .setDescription("za co taka sroga kara w postaci przerwy na 28 dni")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, guild } = interaction;

    const user = options.getUser("uzytkownik");
    const reason = options.getString("powod");

    const member = guild.members.cache.get(user.id);

    try {
      // member.disableCommunicationUntil(Date.now() + 28 * 24 * 60 * 60 * 1000);
      await member.timeout(28 * 24 * 60 * 60 * 1000, reason); // 28 days

      console.log("siema");
      await sendEmbed(interaction, {
        description: `# ${member} na szczęście dostał bana na 28 dni!`,
      });

      // interaction.followUp("nara");
      console.log("elo");
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", error);

      sendEmbed(interaction, {
        description: error.message,
        ephemeral: true,
        color: "red",
      });
    }
  },
};
