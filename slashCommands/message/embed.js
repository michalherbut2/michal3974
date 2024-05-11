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
    const modal = new ModalBuilder().setCustomId("embed").setTitle("My Modal");

    const inputs = [];
    // Add components to modal
    inputs.push(
      new TextInputBuilder()
        .setCustomId("custom")
        .setLabel("Napisz cos ciekawe bo bot placze")

        // Short means only a single line of text
        .setStyle(TextInputStyle.Paragraph)
        // set the maximum number of characters to allow
        .setMaxLength(1_000)
        // set the minimum number of characters required for submission
        .setMinLength(10)
        // set a placeholder string to prompt the user
        .setPlaceholder("Enter some text!")
        // set a default value to pre-fill the input
        .setValue("Default siemaskdlasf")
        // require a value in this input field
        .setRequired(true)
    );

    // Create the text input components
    inputs
    new TextInputBuilder()
      .setCustomId("title")
      // The label is the prompt the user sees for this input
      .setLabel("What's your favorite color?")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    const hobbiesInput = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("What's some of your favorite hobbies?")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
    const rowInput = new ActionRowBuilder().addComponents(customInput);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow, rowInput);

    modal.addComponents(
      [
        favoriteColorInput,
        secondActionRow,
        fansInput,
        cpbInput,
        descriptionInput,
      ].map(input => new ActionRowBuilder().addComponents(input))
    );

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
