const { channel } = require("diagnostics_channel");
const { prefix, token } = require("./config.json");

const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
const fs = require("fs");
const { log } = require("console");
const resetUserInactivity = require("./computings/resetUserInactivity");
const sqlite3 = require("sqlite3").verbose();

bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    bot.commands.set(props.config.name, props)
}

const commandSubFolders = fs.readdirSync('./commands/').filter(f => !f.endsWith('.js'))

commandSubFolders.forEach(folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith('.js'))
    for (const file of commandFiles) {
        const props = require(`./commands/${folder}/${file}`)
        console.log(`${file} loaded from ${folder}`)
        bot.commands.set(props.config.name, props)
    }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot))
    } else {
        bot.on(event.name, (...args) => event.execute(...args, bot))
    }
}

//Command Manager
bot.on("messageCreate", async message => {
    
    //Check if author is a bot or the message was sent in dms and return
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    //get prefix from config and prepare message so it can be read as a command
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    let args = messageArray.slice(1);

    //Check for prefix
    if(!cmd.startsWith(prefix)) return;
    //Get the command from the commands collection and then if the command is found run the command file
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);

    if(cmd.includes('imie')) bot.commands.get('imie').run(bot,message,args)
});

bot.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.member.user.bot) return;

  if (!oldState.channel && newState.channel) {
    console.log(
      `${newState.member.user.tag} dołączył do kanału głosowego ${newState.channel.name}.`
    );
    resetUserInactivity(newState.member.user.id);
  }
});

const db = new sqlite3.Database("./user_activity.db");
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, inactivity_days INTEGER DEFAULT 0)"
  );
});

//Token needed in config.json
bot.login(token);
