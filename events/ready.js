const checkInactivity = require("../computings/checkInactivity");
const createAudioPlayers = require("../computings/createAudioPlayers");
const createDatabases = require("../computings/createDatabases");
const loadConfig = require("../computings/loadConfig");
// const updateList = require("../computings/updateList");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
      //Log client's username and the amount of servers its in to console
      console.log(
        `${client.user.username} is online on ${client.guilds.cache.size} servers!`
      );
// client.guilds.cache.forEach(guild => {
//   console.log("elo", guild.name);
// });

      //Set the Presence of the client user
      client.user.setPresence({ activities: [{ name: "Jak tam pogoda?" }] });
      createDatabases(client)
      createAudioPlayers(client);
      await loadConfig(client);
      // console.log(client.config.get("883720564970250290"));
      // console.log(client.config);
;
      // updateList(client)
      // client.user.setAvatar("img/kot_bot.jpg");
      // client.commands.get("nb").run(client, "","");
    }
}
