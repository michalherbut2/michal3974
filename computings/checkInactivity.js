const incrementUserInactivity = require("./incrementUserInactivity");
const resetUserInactivity = require("./resetUserInactivity");
const betterSqlite3 = require("better-sqlite3");

module.exports = async (client, guildId) => {
  console.log("sprawdzam nieobecność w",guildId);
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    console.error("Serwer nie został znaleziony.");
    return;
  }
  const db = new betterSqlite3(`db/db_${guildId}.db`);
  const config = await client.config.get(guildId);
  const role = guild.roles.cache.get(config.aktywna_rola);

  if (!role) {
    console.error("Rola nie została znaleziona.");
    return;
  }

  // const intervalInMilliseconds = 100_000; // 10 sec
  // const intervalInMilliseconds = 86_400_000; // 1 day
  // const weekInMilliseconds = 7 * intervalInMilliseconds; // Tydzień w milisekundach

  // setInterval(async () => {

    const commandsChannel = await client.channels.cache.get(
      config.kanal_do_komend
    );
    // "1124032895263195199"

    commandsChannel.send("Dodano nieobecności adminom!");
    guild.members.fetch().then(members => {
      members.forEach(async member => {
        const memberId = member.user.id;
        const hasRole = member.roles.cache.some(
          role => role.id === config.aktywna_rola
        );
        if (hasRole) {
          incrementUserInactivity(memberId, db);

          const row = db
            .prepare("SELECT inactivity_num FROM inactivity WHERE user_id = ?")
            .run(memberId);
          if (row && row.inactivityDays >= 7) {
            member.roles
              .remove(role)
              .then(() =>
                console.log(
                  `Usunięto rolę ${role.name} od użytkownika ${member.user.tag}.`
                )
              )
              .catch(console.error);
            resetUserInactivity(memberId);
          }
        }
      });
    });
  // }, intervalInMilliseconds); // Sprawdzaj co minutę
};