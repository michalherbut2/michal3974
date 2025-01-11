const { TOKEN } = require("./config.json");
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const loadSlashCommands = require("./functions/settings/loadSlashCommands");

// Initialize the Discord client with necessary intents and partials
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers, // Privileged intent
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildModeration, // Audit log
  ],
  partials: [
    Partials.Channel,
    Partials.Message, // Handle DM messages
  ],
});

// Load event files from the events folder
const loadEvents = (client) => {
  const eventFiles = fs.readdirSync("./events/").filter(f => f.endsWith(".js"));
  for (const file of eventFiles) {
    try {
      const event = require(`./events/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    } catch (error) {
      console.error(`Failed to load event file ${file}:`, error);
    }
  }
};

// Ensure the database directory exists
const ensureDbDirectoryExists = () => {
  const dbDirectory = path.join(__dirname, 'db');
  if (!fs.existsSync(dbDirectory)) {
    try {
      fs.mkdirSync(dbDirectory, { recursive: true });
      console.log(`Database directory created at ${dbDirectory}`);
    } catch (error) {
      console.error("Failed to create database directory:", error);
    }
  }
};

// Initialize various collections
client.queue = new Collection();
client.radio = new Collection();
client.fileQueue = new Collection();
client.interactions = new Collection();
client.buttons = new Collection();
client.config = new Collection();
client.inactivity = new Collection();
client.invites = new Collection();
client.modals = new Collection();

// Load slash commands
loadSlashCommands(client);

// Load events
loadEvents(client);

// Ensure database directory exists
ensureDbDirectoryExists();

const modalPath = path.join(__dirname, "./modals");
const modalFiles = fs.readdirSync(modalPath).filter(file => file.endsWith(".js"));

for (const file of modalFiles) {
  try {
    const modal = require(`./modals/${file}`);
    client.modals.set(modal.name, modal);
  } catch (error) {
    console.error(`Failed to load modal file ${file}:`, error);
  }
}

console.log("Loaded modals:", client.modals.keys());

// Enhanced error handling
client
  .on("warn", (warning) => {
    console.warn("Warning:", warning);
  })
  .on("error", (error) => {
    console.error("Error:", error);
  })
  .on("shardError", (error) => {
    console.error("Shard Error:", error);
  });

// Process error handling
process
  .on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    // Optionally, you could shut down the process if necessary
    // process.exit(1);
  })
  .on("uncaughtExceptionMonitor", (err) => {
    console.error("Uncaught Exception Monitor:", err);
  })
  .on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Shutting down gracefully...");
  client.destroy().catch((err) => {
    console.error("Error during client shutdown:", err);
  });
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Login to Discord with improved error handling
client.login(TOKEN).catch((err) => {
  console.error("Failed to login:", err);
  process.exit(1); // Exit the process if login fails
});
