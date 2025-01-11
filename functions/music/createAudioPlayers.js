const ServerQueue = require("../../models/ServerQueue");
const RadioQueue = require("../../models/RadioQueue");

module.exports = async (client) => {
  try {
    // Initialize the queue for each guild in the client's cache
    client.guilds.cache.forEach((guild) => {
      try {
        client.queue.set(guild.id, new ServerQueue());
        client.radio.set(guild.id, new RadioQueue());
      } catch (error) {
        console.error(`Failed to initialize queue for guild ${guild.id}:`, error);
      }
    });
  } catch (error) {
    console.error("Error initializing queues for all guilds:", error);
  }
};