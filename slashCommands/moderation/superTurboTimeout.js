const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const sendEmbed = require("../../computings/messages/sendEmbed");

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
    console.log("interaction:", interaction);
    const { options, guild } = interaction;

    const user = options.getUser("uzytkownik");
    const reason = options.getString("powod");

    const member = guild.members.cache.get(user.id);

    // member.disableCommunicationUntil(Date.now() + 28 * 24 * 60 * 60 * 1000);
    member.timeout(28 * 24 * 60 * 60 * 1000, reason); // 28 days

    console.log("siema");
    await sendEmbed(interaction, {
      description: `# ${member} naszczęsie dostał bana na 28 dni.`,
    });

    // interaction.followUp("nara");
    console.log("elo");
  },
};
