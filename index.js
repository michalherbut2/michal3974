const { prefix, token } = require("./config.json");
const {
  Client,
  GatewayIntentBits,
  Collection,
  IntentsBitField,
  Events,
} = require("discord.js");
const fs = require("fs");
const resetUserInactivity = require("./computings/resetUserInactivity");
const loadSlashCommands = require("./computings/loadSlashCommands");
const betterSqlite3 = require("better-sqlite3");
// const { log } = require("console");
// const sqlite3 = require("sqlite3").verbose();

const client = new Client({
  intents: [
    // IntentsBitField.Flags.Guilds, // -special structure in discord.js that allows you to modify a bitfield, using functions like add() and remove()
    GatewayIntentBits.Guilds, // .GUILDS,//
    GatewayIntentBits.GuildMessages, // .GUILD_MESSAGES,
    GatewayIntentBits.GuildMembers, // .GUILD_MEMBERS,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, // .GUILD_VOICE_STATES,
  ],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const props = require(`./commands/${file}`);
  console.log(`${file} loaded`);
  ``;
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

//Command Manager
client.on("messageCreate", async message => {
  //Check if author is a client or the message was sent in dms and return
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  //get prefix from config and prepare message so it can be read as a command
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0]
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  let args = messageArray.slice(1);

  //Check for prefix
  if (!cmd.startsWith(prefix)) return;
  //Get the command from the commands collection and then if the command is found run the command file
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(client, message, args);

  if (cmd.includes("imie"))
    client.commands.get("imie").run(client, message, args);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.member.user.bot) return;

  if (!oldState.channel && newState.channel) {
    // console.log(
    //   `${newState.member.user.tag} dołączył do kanału głosowego ${newState.channel.name}.`
    // );
    resetUserInactivity(newState.member.user.id);
  }
});

// const user_activityDb = new sqlite3.Database("./user_activity.db");
const user_activityDb = betterSqlite3("user_activity.db");
const plusyDb = betterSqlite3("plusy.db");
const warnsDb = betterSqlite3("warns.db");

user_activityDb
  .prepare(
    "CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, inactivity_days INTEGER DEFAULT 0)"
  )
  .run();

plusyDb
  .prepare(
    "CREATE TABLE IF NOT EXISTS pluses (userId TEXT, pluses INTEGER)"
    // 'CREATE TABLE IF NOT EXISTS pluses (userId TEXT PRIMARY KEY, pluses INTEGER)'
  )
  .run();

warnsDb
  .prepare(
    "CREATE TABLE IF NOT EXISTS ostrzezenia (userId TEXT PRIMARY KEY, warnings INTEGER DEFAULT 0)"
  )
  .run();

client.isPlaying = false;
client.queue = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();

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

client.login(token);
