const { REST, Routes } = require("discord.js");
const { CLIENT_ID, TOKEN } = require("../config.json");

const rest = new REST().setToken(TOKEN);

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "../slashCommands");
const commandFolders = fs.readdirSync(foldersPath);

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

async function registerCommandsOnGuild(guildId) {
  try {
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guildId),
      { body: commands }
    );

    console.log(`Successfully registered ${data.length} commands on guild ${guildId}.`);
  } catch (error) {
    console.error(`Error registering commands on guild ${guildId}:`, error);
  }
}

async function registerCommandsOnAllGuilds(client) {
  try {
    // Pobierz wszystkie serwery z cache klienta
    const guilds = client.guilds.cache.array();

    // Rejestruj komendy na każdym serwerze
    for (const guild of guilds) {
      await registerCommandsOnGuild(guild.id);
    }
  } catch (error) {
    console.error("Error registering commands on all guilds:", error);
  }
}

// Wywołaj funkcję, aby zarejestrować komendy na wszystkich serwerach przy uruchomieniu
registerCommandsOnAllGuilds(Client); // Podmień 'yourClientInstance' na odpowiednią nazwę zmiennej przechowującą klienta Discord.js

// Obsługuj dołączanie do nowej gildii
// (Możesz dodatkowo dostosować to zdarzenie do swoich potrzeb)
yourClientInstance.on("guildCreate", async (guild) => {
  console.log(`Joined a new guild: ${guild.name} (${guild.id})`);

  // Rejestruj komendy na nowo dołączonym serwerze
  await registerCommandsOnGuild(guild.id);
});

// ... (Dodatkowy kod do obsługi innych zdarzeń i funkcji bota)
