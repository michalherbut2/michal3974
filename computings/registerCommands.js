const { Client } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client();
const commands = [];

const rest = new REST().setToken(token);

client.once('ready', () => {
  console.log(`Bot is ready!`);
  updateCommands();
});

client.on('guildCreate', (guild) => {
  console.log(`Bot joined a new guild: ${guild.name} (${guild.id})`);
  updateCommands();
});

async function updateCommands() {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Deploy commands globally to all servers where the bot is present
    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, '../slashCommands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}


