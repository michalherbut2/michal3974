const sendEmbed = require("../functions/messages/sendEmbed");

module.exports = {
  name: "embed",

  async execute(interaction) {
    try {
      // Ensure fields are provided in the interaction
      if (!interaction.fields) {
        throw new Error("No fields provided in the interaction.");
      }

      // Get the title and description from the interaction fields
      const title = interaction.fields.getTextInputValue("title");
      const description = interaction.fields.getTextInputValue("description");

      // Ensure title and description are provided
      if (!title || !description) {
        throw new Error("Title or description is missing.");
      }

      // Send embed message
      await sendEmbed(interaction, {
        title,
        description,
      });

      console.log("Embed message sent successfully.");

    } catch (error) {
      console.error("Error executing embed command:", error.message);
      
      // Send error message to the interaction
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