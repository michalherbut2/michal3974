const { Events } = require("discord.js");
const { glob } = require("glob");
const sendEmbed = require("../messages/sendEmbed");
const handleButtons = require("./handleButtons");

module.exports = async client => {
    const commandFiles = await glob(`${process.cwd()}/interactions/**/**/*.js`);
      commandFiles.map(file => {
        const command = require(file);
        
        if (!command?.data || !command?.execute)
          throw new Error(
            `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
          );
        
          client.slashCommands.set(command.data.name, command);
      });

  handleButtons(client);

  // contextMenus
  const contextMenus = await glob(`${process.cwd()}/contextMenus/*.js`);
  contextMenus.map(value => {
    const file = require(value);

    if (!file?.data || !file?.execute) return console.log("coś nie tak");
    client.contextMenus.set(file.data.name, file);
  });
  
  // modals
  const modals = await glob(`${process.cwd()}/modals/*.js`);
  modals.map(value => {
    const file = require(value);

    if (!file?.name) return console.log("coś nie tak");
    client.modals.set(file.name, file);
  });

  
};
