const { Events } = require("discord.js");
const sendEmbed = require("../functions/messages/sendEmbed");

module.exports = {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction) {
    const { client, commandName, customId } = interaction;

    try {
      // Handle slash commands
      if (interaction.isChatInputCommand()) {
        const command = client.interactions.get(commandName);

        if (!command) {
          throw new Error(`Command "${commandName}" not found!`);
        }

        await command.execute(interaction);
      } 
      // Handle button interactions
      else if (interaction.isButton()) {
        const button = client.buttons.get(customId);

        if (!button) {
          throw new Error(`Button "${customId}" not found!`);
        }

        await button.execute(interaction);
      } 
      // Handle context menu commands
      else if (interaction.isUserContextMenuCommand()) {
        const contextMenu = client.interactions.get(commandName);

        if (!contextMenu) {
          throw new Error(`Context menu "${commandName}" not found!`);
        }

        await contextMenu.execute(interaction);
      } 
      // Handle modal submissions
      else if (interaction.isModalSubmit()) {
        const modal = client.modals.get(customId);

        if (!modal) {
          throw new Error(`Modal "${customId}" not found!`);
        }

        await modal.execute(interaction);
      } else {
        throw new Error(`Unhandled interaction type: ${interaction.type}`);
      }
    } catch (error) {
      console.error("Interaction handling error:", error);

      if (interaction.replied || interaction.deferred) {
        await sendEmbed(interaction, {
          description: error.message,
          ephemeral: true,
          followUp: true,
        });
      } else {
        await sendEmbed(interaction, { description: error.message, ephemeral: true });
      }
    }
  },
};