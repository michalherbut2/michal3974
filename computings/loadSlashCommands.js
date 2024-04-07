const { Events } = require("discord.js");
const fs = require("fs");
const handleButtons = require("./handleButtons");
const { replySimpleEmbed } = require("./createEmbed");

// require("dotenv").config();
const { glob } = require("glob");
const { promisify } = require("util");
const sendEmbed = require("./messages/sendEmbed");
const globPromise = promisify(glob);

module.exports = async client => {
  const foldersPath = "./slashCommands/";
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`${foldersPath}${folder}`)
      .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`.${foldersPath}${folder}/${file}`);

      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command)
        client.slashCommands.set(command.data.name, command);
      else
        console.log(
          `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
        );
    }
  }

  handleButtons(client);

  // contextMenus
  const contextMenus = await globPromise(`${process.cwd()}/contextMenus/*.js`);
  contextMenus.map(value => {
    const file = require(value);

    if (!file?.data || !file?.execute) return console.log("coś nie tak");
    client.contextMenus.set(file.data.name, file);
    // commands.push(file.data);
  });
  
  // modals
  const modals = await globPromise(`${process.cwd()}/modals/*.js`);
  modals.map(value => {
    const file = require(value);

    if (!file?.name) return console.log("coś nie tak");
    client.modals.set(file.name, file);
    // commands.push(file.data);
  });

  client.on(Events.InteractionCreate, async interaction => {
    console.log(interaction.isUserContextMenuCommand());
    // slash commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName
      );

      if (!command)
        return console.error(
          `No command matching ${interaction.commandName} was found.`
        );

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred)
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        else
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
      }
      // buttons
    } else if (interaction.isButton()) {
      const { buttons } = client;

      const { customId } = interaction;

      const button = buttons.get(customId);

      if (!button) return new Error("There is no code for this button");

      try {
        await button.execute(interaction);
      } catch (err) {
        console.error(err);
      }
      // context menus commands
    } else if (interaction.isUserContextMenuCommand()) {
      const { contextMenus } = client;

      const { commandName } = interaction;

      const contextMenu = contextMenus.get(commandName);

      if (!contextMenu)
        throw new Error("There is no code for this context menu");

      try {
        await contextMenu.execute(interaction);
      } catch (err) {
        console.error(err);
        sendEmbed(interaction, { description: err.message });
      }
    } else if (interaction.isModalSubmit()) {
      const { modals } = client;
  
      const { customId } = interaction;
  
      const modal = modals.get(customId);
  
      // console.log(modals, customId, modal);
  
      try {
        if (!modal) throw new Error("There is no code for this modal");
  
        await modal.execute(interaction);
      } catch (err) {
        console.error(err);
      }
    }
  });
};
