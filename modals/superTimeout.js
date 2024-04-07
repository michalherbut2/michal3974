const sendEmbed = require("../computings/messages/sendEmbed");

module.exports = {
  name: "superTimeout",

  async execute(interaction) {
    const { fields } = interaction;

    const confirm = fields.getTextInputValue("confirm");
    const reason = fields.getTextInputValue("reason");

    if (confirm.toLowerCase() === "tak") {
      member.timeout(28 * 24 * 60 * 60 * 1000, reason); // 28 days
      // await interaction.reply({ embeds: [createEmbed("Komendy", content)] });

      sendEmbed(interaction, {
        description: `# ${member} dostał elegancką przerwę na 28 dni`,
      });
    } else
      sendEmbed(interaction, {
        description: `${member} niestety nie dostał eleganckiej przerwy na 28 dni ):`,
      });
    console.log(confirm, reason);
  },
};
