const {
  SlashCommandBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Returns embed"),

  async execute(interaction) {
    try {
      // Create a modal
      const modal = new ModalBuilder()
        .setCustomId("embed")
        .setTitle("Stwórz embed");

      // Create the text input components
      const titleInput = new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Tytuł embeda [może być pusty]")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const descriptionInput = new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Zawartość embeda")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      // Add inputs to the modal
      modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(descriptionInput)
      );

      // Show the modal to the user
      await interaction.showModal(modal);
    } catch (error) {
      console.error("Błąd podczas tworzenia modala:", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas tworzenia modala.",
        ephemeral: true,
      });
    }
  },
};