const checkInactivity = require("../computings/checkInactivity");
const updateList = require("../computings/updateList");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      //Log client's username and the amount of servers its in to console
      console.log(
        `${client.user.username} is online on ${client.guilds.cache.size} servers!`
      );

      //Set the Presence of the client user
      client.user.setPresence({ activities: [{ name: "Jak tam pogoda?" }] });
      updateList(client)
      checkInactivity(client);
      // bot.user.setAvatar("img/logo.jpg");
      // client.commands.get("nb").run(client, "","");
    }
}
