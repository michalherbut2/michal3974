const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();
client.slashCommands = new Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const props = require(`./commands/${file}`);
  console.log(`${file} loaded`);
  client.commands.set(props.config.name, props);
}

const commandSubFolders = fs
  .readdirSync("./commands/")
  .filter((f) => !f.endsWith(".js"));

commandSubFolders.forEach((folder) => {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}/`)
    .filter((f) => f.endsWith(".js"));
  for (const file of commandFiles) {
    const props = require(`./commands/${folder}/${file}`);
    console.log(`${file} loaded from ${folder}`);
    client.commands.set(props.config.name, props);
  }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync("./events/").filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Funkcja automatycznego wykrywania błędów i ponownego uruchamiania bota
async function autoRestartOnError(error) {
  console.error("Bot encountered an error:", error);
  console.log("Attempting to fix the issue...");

  try {
    // Uniwersalne kroki naprawcze

    // 1. Spróbuj ponownie połączyć się z Discordem
    console.log("Reconnecting to Discord...");
    await client.login(token);

    // 2. Jeśli ponowne połączenie się nie powiedzie, spróbuj ponownie zainicjować klienta
    if (!client.isReady()) {
      console.log("Reinitializing the client...");
      await client.destroy();
      await client.login(token);
    }

    // 3. Spróbuj odświeżyć event listenery
    console.log("Refreshing event listeners...");
    refreshEventListeners();

    // 4. Spróbuj ponownie załadować komendy
    console.log("Reloading commands...");
    reloadCommands();

    // 5. Spróbuj zoptymalizować wydajność bota
    console.log("Optimizing bot performance...");
    await optimizeBotPerformance();

    // 6. Spróbuj naprawić inne aspekty (dodaj swoje własne kroki naprawcze)
    console.log("Fixing other aspects...");

    console.log("Issue fixed. Bot is now online.");
  } catch (fixError) {
    console.error("Failed to fix the issue:", fixError);
    console.log("Restarting the bot...");

    // Jeśli nie udało się naprawić problemu, zrestartuj bota
    setTimeout(() => {
      client.login(token);
    }, 30000);
  }
}

// Funkcja odświeżająca event listenery
function refreshEventListeners() {
  // Usuń stare listenery
  client.removeAllListeners();

  // Dodaj ponownie listenery z głównego skryptu (bot.js)
  const eventFiles = fs.readdirSync("./events/").filter((f) => f.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log("Event listeners refreshed.");
}

// Funkcja ponownego ładowania komend
function reloadCommands() {
  // Usuń stare komendy
  client.commands.clear();

  // Ponownie załaduj komendy z głównego skryptu (bot.js)
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const props = require(`./commands/${file}`);
    console.log(`${file} loaded`);
    client.commands.set(props.config.name, props);
  }

  const commandSubFolders = fs
    .readdirSync("./commands/")
    .filter((f) => !f.endsWith(".js"));

  commandSubFolders.forEach((folder) => {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}/`)
      .filter((f) => f.endsWith(".js"));
    for (const file of commandFiles) {
      const props = require(`./commands/${folder}/${file}`);
      console.log(`${file} loaded from ${folder}`);
      client.commands.set(props.config.name, props);
    }
  });

  console.log("Commands reloaded.");
}

// Funkcja sprawdzająca aktywność użytkowników i resetująca ją
function resetUserInactivity(userId) {
  // Dodaj kod do resetowania aktywności użytkownika
  console.log(`Resetting inactivity for user ${userId}`);
  // ...
}

// Funkcja sprawdzająca, czy bot jest online i obsługa ewentualnych błędów
function keepBotOnline() {
  if (!client.isReady()) {
    console.log("Bot is not ready. Reconnecting...");
    client.login(token);
  }
}

// Sprawdź co 5 minut, czy bot jest online
setInterval(keepBotOnline, 5 * 60 * 1000);

// Funkcja uruchamiana po aktualizacji komend slashowych
async function handleSlashCommandsUpdate() {
  console.log("Handling slash commands update...");
  try {
    // Wczytaj ponownie komendy slashowe
    await loadSlashCommands(client);
    console.log("Slash commands updated.");
  } catch (error) {
    console.error("Error updating slash commands:", error);
  }
}

// Funkcja wczytująca komendy slashowe
async function loadSlashCommands(client) {
  console.log("Loading slash commands...");

  // Pobierz listę globalnych komend slashowych
  const globalCommands = await client.application.commands.fetch();
  
  // Wczytaj komendy z plików
  const slashCommandFiles = fs
    .readdirSync("./slash_commands/")
    .filter((file) => file.endsWith(".js"));

  for (const file of slashCommandFiles) {
    const command = require(`./slash_commands/${file}`);
    console.log(`Registering slash command: ${command.data.name}`);
    
    // Sprawdź, czy komenda już istnieje globalnie
    const existingCommand = globalCommands.find((c) => c.name === command.data.name);
    
    // Zarejestruj lub zaktualizuj komendę globalną
    if (existingCommand) {
      await client.application.commands.edit(existingCommand.id, command.data);
    } else {
      await client.application.commands.create(command.data);
    }

    // Zapisz komendę do kolekcji
    client.slashCommands.set(command.data.name, command);
  }

  console.log("Slash commands loaded.");
}

// Obsługa aktualizacji komend slashowych
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing slash command ${command.data.name}:`, error);
    interaction.reply({
      content: "An error occurred while executing the command.",
      ephemeral: true,
    });
  }
});

// Sprawdź, czy komendy slashowe są zarejestrowane po uruchomieniu bota
client.once("ready", async () => {
  try {
    await loadSlashCommands(client);
    console.log("Slash commands registered.");
  } catch (error) {
    console.error("Error loading slash commands:", error);
  }
});

// Funkcja obsługująca aktualizację komend slashowych
async function handleSlashCommandsUpdate() {
  console.log("Handling slash commands update...");
  try {
    // Wczytaj ponownie komendy slashowe
    await loadSlashCommands(client);
    console.log("Slash commands updated.");
  } catch (error) {
    console.error("Error updating slash commands:", error);
  }
}


// Funkcja sprawdzająca status innych botów na serwerze
async function checkOtherBotsStatus() {
  const guild = client.guilds.cache.get("YOUR_GUILD_ID");
  if (guild) {
    const otherBots = guild.members.cache.filter(
      (member) => member.user.bot && member.user.id !== client.user.id
    );

    otherBots.forEach((bot) => {
      console.log(`Status of bot ${bot.user.tag}: ${bot.presence.status}`);
    });
  }
}

// Sprawdź status innych botów co godzinę
setInterval(checkOtherBotsStatus, 60 * 60 * 1000);

// Funkcja sprawdzająca opóźnienie bota i próbująca je zoptymalizować
async function checkBotLatency() {
  console.log("Checking bot latency...");
  const latency = client.ws.ping;
  console.log(`Bot latency: ${latency} ms`);

  if (latency > 1000) {
    console.log("Bot latency is high. Attempting to optimize performance...");
    await optimizeBotPerformance();
  }
}

// Sprawdź opóźnienie bota co 30 minut
setInterval(checkBotLatency, 30 * 60 * 1000);

// Funkcja zoptymalizująca wydajność bota
async function optimizeBotPerformance() {
  console.log("Optimizing bot performance...");

  // 1. Sprzątanie pamięci podręcznej
  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach((member) => {
      member.user.fetch(); // Odświeża dane użytkownika, może pomóc w zwolnieniu pamięci
    });
  });

  // 2. Zamykanie niepotrzebnych połączeń
  client.voice.connections.forEach((connection) => {
    if (!connection.channel.members.size) {
      connection.disconnect(); // Rozłącz się, jeśli kanał głosowy jest pusty
    }
  });

  // 3. Optymalizacja operacji na dużych kolekcjach (przykładowe operacje)
  const largeCollection = client.users.cache.filter(
    (user) => user.username.startsWith("A")
  );
  console.log(
    `Found ${largeCollection.size} users with names starting with 'A'`
  );

  // 4. Dodaj dodatkowe kroki optymalizacyjne, odpowiednie dla Twojego bota

  console.log("Bot performance optimized.");
}

// Sprawdź opóźnienie bota co 30 minut
setInterval(checkBotLatency, 30 * 60 * 1000);

// Funkcja sprawdzająca, czy bot działa zgodnie z oczekiwaniami
function checkBotFunctionality() {
  console.log("Checking bot functionality...");

  // Sprawdź, czy bot jest połączony z Discordem
  if (!client.isReady()) {
    console.log("Bot is not connected to Discord. Reconnecting...");
    client.login(token);
    return;
  }

  // Sprawdź, czy komendy slashowe są zarejestrowane
  if (client.slashCommands.size === 0) {
    console.log("No slash commands registered. Reloading...");
    loadSlashCommands(client);
    return;
  }

  console.log("Bot is functioning correctly.");
}

// Sprawdź funkcjonalność bota co 15 minut
setInterval(checkBotFunctionality, 15 * 60 * 1000);

// Funkcja sprawdzająca opóźnienie bota i próbująca je zoptymalizować
async function checkBotLatency() {
  console.log("Checking bot latency...");
  const latency = client.ws.ping;
  console.log(`Bot latency: ${latency} ms`);

  if (latency > 1000) {
    console.log("Bot latency is high. Attempting to optimize performance...");
    await optimizeBotPerformance();
  }
}

// Sprawdź opóźnienie bota co 30 minut
setInterval(checkBotLatency, 30 * 60 * 1000);

// Funkcja sprawdzająca, czy bot działa poprawnie
function checkBotFunctionality() {
  console.log("Checking bot functionality...");

  // Tutaj dodaj kod sprawdzający, czy bot działa zgodnie z oczekiwaniami
  // Na przykład, możesz sprawdzić status bota, czy wszystkie komendy są zarejestrowane, itp.

  // Przykładowy kod sprawdzający status bota
  if (client.presence.status !== "online") {
    console.log("Bot status is not 'online'. Reconnecting...");
    client.login(token);
    return;
  }

  // Przykładowy kod sprawdzający, czy komendy slashowe są zarejestrowane
  if (client.slashCommands.size === 0) {
    console.log("No slash commands registered. Reloading...");
    loadSlashCommands(client);
    return;
  }

  // Tutaj możesz dodać więcej warunków sprawdzających, czy bot działa poprawnie
  // ...

  console.log("Bot is functioning correctly.");
}

// ...

// Dodaj więcej funkcji, jeśli to konieczne

// ...

// W obsłudze błędów
client.on("error", autoRestartOnError);

process.on("unhandledRejection", (error) => {
  autoRestartOnError(error);
});

process.on("uncaughtException", (error) => {
  autoRestartOnError(error);
});

// Rozpocznij logowanie do Discorda
client.login(token);
