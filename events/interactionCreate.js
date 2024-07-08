const { Events } = require("discord.js");
const sendEmbed = require("../functions/messages/sendEmbed");

module.exports = {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction) {
    const { client, commandName, customId } = interaction;

    try {
      // slash commands
      if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(commandName);

        if (!command) throw new Error(`${commandName} command not found!.`);

        await command.execute(interaction);
      } else if (interaction.isButton()) {
        // buttons
        const button = client.buttons.get(customId);

        if (!button) throw new Error(`${customId} button not found!`);

        await button.execute(interaction);
      } else if (interaction.isUserContextMenuCommand()) {
        // context menus commands
        const contextMenu = client.contextMenus.get(commandName);

        if (!contextMenu)
          throw new Error(`${commandName} context menu not found!`);

        await contextMenu.execute(interaction);
      } else if (interaction.isModalSubmit()) {
        const modal = client.modals.get(customId);
        if (!modal) throw new Error(`${customId} modal not found!`);

        await modal.execute(interaction);
      }
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred)
        sendEmbed(interaction, {
          description: err.message,
          ephemeral: true,
          followUp: true,
        });
      else
        sendEmbed(interaction, { description: error.message, ephemeral: true });
    }
  },
};
