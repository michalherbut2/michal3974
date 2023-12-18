const ServerQueue = require("../models/ServerQueue");
const RadioQueue = require("../models/RadioQueue");

module.exports = async client => {
  
  client.guilds.cache.forEach(guild =>
    client.queue.set(guild.id, new ServerQueue())
  );
  
  client.guilds.cache.forEach(guild => client.radio.set(guild.id, new RadioQueue()));
};
