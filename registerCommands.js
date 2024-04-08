const { REST, Routes } = require("discord.js");
const { CLIENT_ID, GUILD_ID, TOKEN } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

// require("dotenv").config();
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

// ##### config #####
// ### production ###
const registerGlobal = true;
const clearCommands = false;

// ###    test    ###
// const registerGlobal = false;
// const clearCommands = true;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "/slashCommands");
// const foldersPath = __dirname;
const commandFolders = fs.readdirSync(foldersPath);

if (!clearCommands)
  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(file => file.endsWith(".js"));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);

// and deploy your commands!
(async () => {
  // contextMenus
  if (!clearCommands) {
    const contextMenus = await globPromise(`${process.cwd()}/contextMenus/*.js`);
    contextMenus.map(value => {
      const file = require(value);
    
      if (!file?.data || !file?.execute) return console.log("coś nie tak");
      commands.push(file.data);
    });
}


  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    let data = [];

    if (registerGlobal) {
      data = await rest.put(
        // global
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
    } else {
      // The put method is used to fully refresh all commands in the guild with the current set
      data = await rest.put(
        // GARY FARMING
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
    }

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
