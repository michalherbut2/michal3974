const { EmbedBuilder } = require("discord.js");

const image =
  "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS3FweCY-fXGzKZ07-P-PhVZqzpe59ABNS2uE27KztZ1Cjo493Q";

// Function to create an embed with a title, description, and optional color
const createEmbed = (title, description, color = 0x0099ff) => {
  try {
    return new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setURL("https://youtube.com/@jura3")
      .setAuthor({
        name: "Stary w śpiworze",
        iconURL: image,
        url: "https://youtube.com/@jura3",
      })
      .setThumbnail(image);
  } catch (error) {
    console.error("Error creating embed:", error);
    throw new Error("Failed to create embed.");
  }
};

// Function to create a simple embed with a description
const createSimpleEmbed = (description) => {
  try {
    return new EmbedBuilder().setColor(0x0099ff).setDescription(description);
  } catch (error) {
    console.error("Error creating simple embed:", error);
    throw new Error("Failed to create simple embed.");
  }
};

// Function to create a warning embed with a description
const createWarningEmbed = (description) => {
  try {
    return new EmbedBuilder().setColor(0xff0000).setDescription(description);
  } catch (error) {
    console.error("Error creating warning embed:", error);
    throw new Error("Failed to create warning embed.");
  }
};

// Function to create a success embed with a description
const createSuccessEmbed = (description) => {
  try {
    return new EmbedBuilder().setColor(0x3ba55c).setDescription(description);
  } catch (error) {
    console.error("Error creating success embed:", error);
    throw new Error("Failed to create success embed.");
  }
};

// Function to reply with an embed
const replyEmbed = async (interaction, title, description) => {
  try {
    await interaction.reply({
      embeds: [createEmbed(title, description)],
    });
  } catch (error) {
    console.error("Error replying with embed:", error);
    await interaction.reply({
      content: "Failed to send embed.",
      ephemeral: true,
    });
  }
};

// Function to reply with a simple embed
const replySimpleEmbed = async (interaction, description) => {
  try {
    await interaction.reply({
      embeds: [createSimpleEmbed(description)],
    });
  } catch (error) {
    console.error("Error replying with simple embed:", error);
    await interaction.reply({
      content: "Failed to send simple embed.",
      ephemeral: true,
    });
  }
};

// Function to reply with a warning embed
const replyWarningEmbed = async (interaction, description) => {
  try {
    await interaction.reply({
      embeds: [createWarningEmbed(description)],
    });
  } catch (error) {
    console.error("Error replying with warning embed:", error);
    await interaction.reply({
      content: "Failed to send warning embed.",
      ephemeral: true,
    });
  }
};

// Export the functions for use in other modules
module.exports = {
  createEmbed,
  createSimpleEmbed,
  createWarningEmbed,
  createSuccessEmbed,
  replyEmbed,
  replySimpleEmbed,
  replyWarningEmbed,
};