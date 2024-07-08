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
    const modal = new ModalBuilder()
      .setCustomId("embed")
      .setTitle("Strwórz embed");

    const inputs = [];
    // // Add components to modal
    // inputs.push(
    //   new TextInputBuilder()
    //     .setCustomId("custom")
    //     .setLabel("Napisz cos ciekawe bo bot placze")

    //     // Short means only a single line of text
    //     .setStyle(TextInputStyle.Paragraph)
    //     // set the maximum number of characters to allow
    //     .setMaxLength(1_000)
    //     // set the minimum number of characters required for submission
    //     .setMinLength(10)
    //     // set a placeholder string to prompt the user
    //     .setPlaceholder("Enter some text!")
    //     // set a default value to pre-fill the input
    //     .setValue("Default siemaskdlasf")
    //     // require a value in this input field
    //     .setRequired(true)
    // );

    // Create the text input components
    // inputs
    inputs.push(
      new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Tytuł embeda [może być pusty]")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
    );

    inputs.push(
      new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Zawartość embeda")
        .setStyle(TextInputStyle.Paragraph)
    );

    // Add inputs to the modal
    modal.addComponents(
      inputs.map(input => new ActionRowBuilder().addComponents(input))
    );

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
