const checkInactivity = require("../computings/checkInactivity");
const updateList = require("../computings/updateList");

module.exports = {
    name: 'ready',
    once: true,
    execute(bot) {
      //Log Bot's username and the amount of servers its in to console
      console.log(
        `${bot.user.username} is online on ${bot.guilds.cache.size} servers!`
      );

      //Set the Presence of the bot user
      bot.user.setPresence({ activities: [{ name: "Jak tam pogoda?" }] });
      updateList(bot)
      checkInactivity(bot);
      // bot.user.setAvatar("img/logo.jpg");
    }
}
