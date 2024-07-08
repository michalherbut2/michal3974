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
    console.log(
      `${client.user.username} is online on ${client.guilds.cache.size} servers!`
    );

    // updateStats(client);

    // Set initial presence
    updatePresence(client);

    // Set interval to update presence every 1 minute
    setInterval(() => {
      updatePresence(client);
    }, 60000); // 1 minute in milliseconds

    createDatabases(client);
    createAudioPlayers(client);
    await loadConfig(client);

    // console.log();
    // const slash = client.slashCommands.map(k => k.data);
    // const menu = client.contextMenus.map(k => k.data);
    //   const array = [...slash, ...menu];
    //   console.log(array.length);
    //   await client.application.commands.set(array);
    //   console.log("siema");

    // invites
    client.guilds.cache.forEach(async guild => {
      const clientMember = guild.members.cache.get(client.user.id);

      if (!clientMember.permissions.has(PermissionsBitField.Flags.ManageGuild))
        return console.log(`no permissions to check invites in ${guild.name}`);

      const firstInvates = await guild.invites.fetch();

      client.invites.set(
        guild.id,
        new Collection(firstInvates.map(invite => [invite.code, invite.uses]))
      );
    });
    console.log("git");
  },
};

function updatePresence(client) {
  const activities = [
    { name: "Gram w Twierdzę!" },
    { name: `Mój ping: ${client.ws.ping}ms` },
    { name: `Jestem na ${client.guilds.cache.size} serwerach!` },
    { name: `Pracuję bez przerwy: ${formatUptime(client.uptime)}` },
    { name: "Jak pogoda?" },
  ];

  const randomActivity =
    activities[Math.floor(Math.random() * activities.length)];

  client.user.setPresence({
    activities: [randomActivity],
  });
}

function formatUptime(uptime) {
  const seconds = Math.floor(uptime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}
