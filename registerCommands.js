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

// Function to load command files
async function loadCommandFiles() {
  try {
    const foldersPath = path.join(__dirname, "interactions");
    const commandFiles = await glob(`${foldersPath}/**/**/*.js`);
    
    commandFiles.forEach(file => {
      const command = require(file);
      
      if (!command?.data || !command?.execute) {
        throw new Error(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
      }
      
      commands.push(command.data);
    });
    
    console.log(`Loaded ${commands.length} command files.`);
  } catch (error) {
    console.error("Error loading command files:", error);
  }
}

// Function to deploy commands
async function deployCommands() {
  try {
    // Validate config values
    if (!CLIENT_ID || !GUILD_ID || !TOKEN) {
      throw new Error("CLIENT_ID, GUILD_ID, or TOKEN is not defined in config.json");
    }

    // Log the IDs to verify they are defined
    console.log(`CLIENT_ID: ${CLIENT_ID}`);
    console.log(`GUILD_ID: ${GUILD_ID}`);
    
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    let data = [];
    if (registerGlobal) {
      data = await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
    } else {
      data = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
    }

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error("Error deploying commands:", error);
  }
}

// Main function to execute the program
(async () => {
  try {
    await loadCommandFiles();

    if (!clearCommands) {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
      console.log(commands.map(command => command.name).join(", "));
    }

    await deployCommands();
  } catch (error) {
    console.error("Error in main execution block:", error);
  }
})();