const { Events } = require("discord.js");
const fs = require("fs");
const handleButtons = require("./handleButtons");

module.exports = client => {
  const foldersPath = "./slashCommands/";
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`${foldersPath}${folder}`)
      .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`.${foldersPath}${folder}/${file}`);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.slashCommands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  handleButtons(client)

  client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName
      );
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton()) {
      const { buttons } = client
      // console.log(buttons);
      const { customId } = interaction
      const button = buttons.get(customId)
      if (!button) return new Error('There is no code for this button')
      try {
        await button.execute(interaction)
      } catch (err){
        console.error(err)
      }
    }
  });
};
