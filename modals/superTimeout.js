const sendEmbed = require("../functions/messages/sendEmbed");

module.exports = {
  name: "superTimeout",

  async execute(interaction) {
    try {
      const { fields, member } = interaction;

      // Ensure fields are provided in the interaction
      if (!fields) {
        throw new Error("No fields provided in the interaction.");
      }

      const confirm = fields.getTextInputValue("confirm");
      const reason = fields.getTextInputValue("reason");

      if (!confirm || !reason) {
        throw new Error("Confirm or reason is missing.");
      }

      if (confirm.toLowerCase() === "tak") {
        await member.timeout(28 * 24 * 60 * 60 * 1000, reason); // 28 days

        await sendEmbed(interaction, {
          description: `# ${member} dostał elegancką przerwę na 28 dni`,
        });
      } else {
        await sendEmbed(interaction, {
          description: `${member} niestety nie dostał eleganckiej przerwy na 28 dni ):`,
        });
      }

      console.log(`Confirm: ${confirm}, Reason: ${reason}`);
    } catch (error) {
      console.error("Error executing superTimeout command:", error.message);

      // Send an error message to the interaction
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: `An error occurred: ${error.message}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `An error occurred: ${error.message}`,
          ephemeral: true,
        });
      }
    }
  },
};