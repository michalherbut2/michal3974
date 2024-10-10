const { REST, Routes } = require("discord.js");
const { CLIENT_ID, GUILD_ID, TOKEN } = require("./config.json");
const path = require("path");
const { glob } = require("glob");

// ##### CONFIG #####
// ### production ###
const registerGlobal = true;
const clearCommands = false;

// ###    test    ###
// const registerGlobal = false;
// const clearCommands = true;

// ##### PROGRAM #####
const commands = [];

// and deploy your commands!
(async () => {
  try {
    // Grab all the command files from the commands directory
    const foldersPath = path.join(__dirname, "interactions");

    const commandFiles = await glob(`${foldersPath}/**/**/*.js`);
    if (!clearCommands)
      // slash commands
      commandFiles.map(file => {
        const command = require(file);
        
        if (!command?.data || !command?.execute)
          throw new Error(
            `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
          );
        
        commands.push(command.data);
      });

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    console.log(commands.map(a=>a.name).join(", "));
    
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(TOKEN);

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
        // JURA TWIERDZA
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
