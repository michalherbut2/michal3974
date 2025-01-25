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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
  ],
});
// Add timestamp to console logs
const formatLog = (level, message) => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
};


// Helper function to load events
const loadEvents = (client) => {
  const eventsPath = path.join(__dirname, "events");
  if (!fs.existsSync(eventsPath)) {
    console.warn("Events folder does not exist:", eventsPath);
    return;
  }

  const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));
  for (const file of eventFiles) {
    try {
      const event = require(`./events/${file}`);
      const eventHandler = event.once ? client.once : client.on;
      eventHandler.call(client, event.name, (...args) => event.execute(...args, client));
    } catch (error) {
      console.error(`Failed to load event file ${file}:`, error);
    }
  }
};

// Ensure database directory exists
const ensureDbDirectoryExists = () => {
  const dbDirectory = path.join(__dirname, "db");
  if (!fs.existsSync(dbDirectory)) {
    try {
      fs.mkdirSync(dbDirectory, { recursive: true });
      console.log(`Database directory created at ${dbDirectory}`);
    } catch (error) {
      console.error("Failed to create database directory:", error);
    }
  }
};

// Load modals
const loadModals = (client) => {
  const modalPath = path.join(__dirname, "modals");
  if (!fs.existsSync(modalPath)) {
    console.warn("Modals folder does not exist:", modalPath);
    return;
  }

  const modalFiles = fs.readdirSync(modalPath).filter((file) => file.endsWith(".js"));
  for (const file of modalFiles) {
    try {
      const modal = require(`./modals/${file}`);
      client.modals.set(modal.name, modal);
    } catch (error) {
      console.error(`Failed to load modal file ${file}:`, error);
    }
  }
};
const loadButtons = (client) => {
 const buttonsPath = path.join(__dirname, "buttons");
 if (!fs.existsSync(buttonsPath)) {
   console.warn("Buttons folder does not exist:", buttonsPath);
   return;
 }
 const buttonFiles = fs.readdirSync(buttonsPath).filter((file) => file.endsWith(".js"));
 for (const file of buttonFiles) {
   try {
     const buttonModule = require(`./buttons/${file}`);
     
     client.buttons.set(buttonModule.data.name, buttonModule);
     console.log(`Loaded button: ${buttonModule.data.name}`);
   } catch (error) {
     console.error(`Failed to load button file ${file}:`, error);
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

// Load slash commands and events
loadSlashCommands(client);
loadEvents(client);

// Ensure database directory exists
ensureDbDirectoryExists();
loadModals(client);
loadButtons(client);

console.log("Loaded modals:", [...client.modals.keys()]);

client
  .on("warn", (warning) => {
    console.warn("Discord Warning:", {
      message: warning,
      timestamp: new Date().toISOString()
    });
  })
  .on("error", (error) => {
    console.error("Detailed Discord Client Error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    fs.appendFileSync('discord-errors.log', 
      JSON.stringify({
        type: 'ClientError',
        message: error.message,
        timestamp: new Date().toISOString()
      }, null, 2) + '\n'
    );
  })
  .on("shardError", (error, shardId) => {
    console.error(`Shard ${shardId} Error:`, {
      message: error.message,
      shardId
    });
  })
  .on("disconnect", (event) => {
    console.warn(`Disconnected Details:`, {
      code: event.code,
      reason: event.reason,
      timestamp: new Date().toISOString()
    });
    attemptReconnect();
  })
  .on("rateLimit", (rateLimitInfo) => {
    console.warn("Rate Limit Encountered:", {
      limit: rateLimitInfo.limit,
      timeout: rateLimitInfo.timeout,
      method: rateLimitInfo.method
    });
  })
  .on("invalidRequestWarning", (info) => {
    console.warn("Invalid Request Details:", {
      count: info.count,
      resetTime: info.resetTime
    });
  })
  .on("debug", (message) => {
    console.debug("Debug Trace:", message);
  })
  .on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  })
  .on("reconnecting", () => {
    console.log("Attempting to reconnect to Discord...");
  })
  .on("resume", (replayed) => {
    console.log(`Resumed connection. Replayed ${replayed} events.`);
  })
  .on("webhookUpdate", (channel) => {
    console.log(`Webhook updated in channel: ${channel.name}`);
  })
  .on("interactionCreate", (interaction) => {
    console.log(`Interaction created: ${interaction.type}`);
  });

const attemptReconnect = () => {
  const MAX_RECONNECT_ATTEMPTS = 5;
  let reconnectAttempts = 0;

  const tryReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached. Manual intervention required.");
      return;
    }

    reconnectAttempts++;
    const backoffTime = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff

    setTimeout(() => {
      client.login(TOKEN)
        .then(() => {
          console.log("Reconnected successfully.");
          reconnectAttempts = 0;
        })
        .catch((err) => {
          console.error(`Reconnection attempt ${reconnectAttempts} failed:`, err);
          tryReconnect();
        });
    }, backoffTime);
  };

  tryReconnect();
};

process
  .on("uncaughtException", (err) => {
    console.error("Critical Uncaught Exception:", {
      type: err.name,
      message: err.message,
      stack: err.stack
    });
//    gracefulShutdown();
  })
  .on("uncaughtExceptionMonitor", (err, origin) => {
    console.error("Exception Monitor:", { err, origin });
  })
  .on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", { reason, promise });
  })
  .on("warning", (warning) => {
    console.warn("Process Warning:", warning);
  })
  .on("beforeExit", (code) => {
    console.log(`Process about to exit with code: ${code}`);
  })
  .on("exit", (code) => {
    console.log(`Process exited with code: ${code}`);
  })
  .on("rejectionHandled", (promise) => {
    console.log("Rejection handled late:", promise);
  })
  .on("messageerror", (error) => {
    console.error("Message Error:", error);
  })
  .on("newListener", (event, listener) => {
    console.log(`New listener added for event: ${event}`);
  })
  .on("removeListener", (event, listener) => {
    console.log(`Listener removed for event: ${event}`);
  });

const gracefulShutdown = async () => {
  try {
    // Close any open connections or resources
    await client.destroy();
    
    // Optional: Perform cleanup operations
    // e.g., close database connections, save state
    
    console.log("Bot shut down gracefully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

client.login(TOKEN).catch((err) => {
  console.error("Discord Login Failure:", {
    errorMessage: err.message,
    errorCode: err.code,
    timestamp: new Date().toISOString()
  });
  
  // Log detailed error information
  fs.appendFileSync('login-errors.log', 
    `[${new Date().toISOString()}] Login Error: ${err.message}\n`, 
    { flag: 'a' }
  );

  // More intelligent error response
  if (err.message.includes('TOKEN')) {
    console.error("Invalid Discord Token. Please check configuration.");
  }

  // Attempt reconnection instead of immediate exit
  attemptReconnect();
});
