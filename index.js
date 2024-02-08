const { TOKEN } = require("./config.json");
const { Client, GatewayIntentBits, Collection, Partials} = require("discord.js");
const fs = require('fs');
const loadSlashCommands = require("./computings/loadSlashCommands");
const { generateNewKeys, generateSignature, verifySignature, limiter } = require("./security.js");

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
    Partials.Message
  ]
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const props = require(`./commands/${file}`);
  console.log(`${file} loaded`);
  client.commands.set(props.config.name, props);
}

const commandSubFolders = fs
  .readdirSync("./commands/")
  .filter(f => !f.endsWith(".js"));

commandSubFolders.forEach(folder => {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}/`)
    .filter(f => f.endsWith(".js"));
  for (const file of commandFiles) {
    const props = require(`./commands/${folder}/${file}`);
    console.log(`${file} loaded from ${folder}`);
    client.commands.set(props.config.name, props);
  }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync("./events/").filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.queue = new Collection();
client.radio = new Collection();
client.fileQueue = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.config = new Collection();
client.inactivity = new Collection();
loadSlashCommands(client);

client
  .on("warn", console.warn)
  .on("error", console.error)
  .on("shardError", console.error);

process
  .on("uncaughtException", console.error)
  .on("uncaughtExceptionMonitor", console.error)
  .on("unhandledRejection", console.error);

// Generate new keys when the bot starts
generateNewKeys();

// Use the limiter middleware
app.use(limiter);

client.login(TOKEN);
