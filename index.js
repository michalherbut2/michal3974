require('dotenv').config();
const TOKEN = process.env.TOKEN;

const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");
const fs = require("fs");
const loadSlashCommands = require("./functions/settings/loadSlashCommands");

const client = new Client({
  intents: [
    // IntentsBitField.Flags.Guilds, // -special structure in discord.js that allows you to modify a bitfield, using functions like add() and remove()
    GatewayIntentBits.Guilds, // .GUILDS,//
    GatewayIntentBits.GuildMessages, // .GUILD_MESSAGES,
    GatewayIntentBits.GuildMembers, // .GUILD_MEMBERS, // privileged intent
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, // .GUILD_VOICE_STATES,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildModeration, // audit log
  ],
  partials: [
    Partials.Channel,
    Partials.Message, // dm
  ],
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
client.interactions = new Collection();
// client.slashCommands = new Collection();
// client.contextMenus = new Collection();
client.buttons = new Collection();
client.config = new Collection();
client.inactivity = new Collection();
client.invites = new Collection();
client.modals = new Collection();

loadSlashCommands(client);
// log(client.slashCommands.get('ping'));
// console.log([...client.slashCommands.entries()]);
// for (const [key, { data }] of client.slashCommands) {
//   console.log(`${key} goes ${data.description}`);
// }

client
  .on("warn", console.warn)
  .on("error", console.error)
  .on("shardError", console.error);

process
  .on("uncaughtException", console.error)
  .on("uncaughtExceptionMonitor", console.error)
  .on("unhandledRejection", console.error);

client.login(TOKEN);
