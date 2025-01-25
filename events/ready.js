const { PermissionsBitField, Collection } = require("discord.js");
const checkInactivity = require("../functions/time/checkInactivity");
const createAudioPlayers = require("../functions/music/createAudioPlayers");
const createDatabases = require("../functions/settings/createDatabases");
const loadConfig = require("../functions/settings/loadConfig");
const updateStats = require("../functions/messages/updateStats");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    try {
      console.log(
        `${client.user.username} is online on ${client.guilds.cache.size} servers!`
      );

      // Update stats
      await updateStats(client);

      // Set initial presence
      updatePresence(client);

      // Set interval to update presence every 1 minute
      setInterval(() => {
        updatePresence(client);
      }, 60000); // 1 minute in milliseconds

      // Initialize databases, audio players and load configurations
      await createDatabases(client);
      createAudioPlayers(client);
      await loadConfig(client);

      // Fetch and store invites for each guild
      client.guilds.cache.forEach(async (guild) => {
        try {
          const clientMember = guild.members.cache.get(client.user.id);

          if (!clientMember.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            console.log(`No permissions to check invites in ${guild.name}`);
            return;
          }

          const firstInvites = await guild.invites.fetch();
          client.invites.set(
            guild.id,
            new Collection(firstInvites.map((invite) => [invite.code, invite.uses]))
          );
        } catch (error) {
          console.error(`Failed to fetch invites for guild ${guild.name}:`, error);
        }
      });

      console.log("Initialization complete.");
    } catch (error) {
      console.error("Error during client initialization:", error);
    }
  },
};

function updatePresence(client) {
  try {
    const activities = [
      { name: "Gram w Twierdzę!" },
      { name: `Mój ping: ${client.ws.ping}ms` },
      { name: `Jestem na ${client.guilds.cache.size} serwerach!` },
      { name: `Pracuję bez przerwy: ${formatUptime(client.uptime)}` },
      { name: "Jak pogoda?" },
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    client.user.setPresence({
      activities: [randomActivity],
    });
  } catch (error) {
    console.error("Error updating presence:", error);
  }
}

function formatUptime(uptime) {
  const seconds = Math.floor(uptime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}