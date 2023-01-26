const Discord = require('discord.js');
const Client = new Discord.Client();
const settings = require('./settings.json');
const fs = require('fs');
const data = require('quick.db');
const express = require('express');
const app = express();

let prefix = settings.prefix;

app.get("/", (req, res) => {
  res.send("I'm alive.");
});

//Load events.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`${eventName} loaded.`);
    Client.on(eventName, event.bind(null, Client));
  });
});

//Load commands.
Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let cmd = require(`./commands/${file}`);
    let cmdFileName = file.split(".")[0];
    Client.commands.set(cmd.help.name, cmd);
    console.log(`${cmdFileName} is loaded.`);
    if (cmd.help.aliases) {
      cmd.help.aliases.forEach(alias => {
        Client.aliases.set(alias, cmd.help.name);
      });
    };
  });
});

//Logging if the bot is online.
Client.on("ready", () => {
  console.log(`${Client.user.tag} is online.`);
  Client.user.setActivity(`${prefix}help`, { type: "PLAYING" });
  Client.user.setStatus(`online`)
});

//Login.
Client.login(settings.key)
