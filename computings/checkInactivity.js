const incrementUserInactivity = require("./incrementUserInactivity");
const { GUILD_ID, ROLE_ID } = require("../config.json");
const resetUserInactivity = require("./resetUserInactivity");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./user_activity.db");

module.exports = client => {
  const guild = client.guilds.cache.get(GUILD_ID);

  if (!guild) {
    console.error("Serwer nie został znaleziony.");
    return;
  }

  const role = guild.roles.cache.get(ROLE_ID);

  if (!role) {
    console.error("Rola nie została znaleziona.");
    return;
  }

  // const intervalInMilliseconds = 10_000; // 10 sec
  const intervalInMilliseconds = 86_400_000; // 1 day
  // const weekInMilliseconds = 7 * intervalInMilliseconds; // Tydzień w milisekundach

  setInterval(async () => {
    const commandsChannel = await client.channels.cache.get("1124032895263195199");
    commandsChannel.send("Dodano nieobecności adminom!");
    guild.members.fetch().then(members => {
      members.forEach(async member => {
        const hasRole = member.roles.cache.some(role => role.id === ROLE_ID);
        if (hasRole) {
          incrementUserInactivity(member.user.id);
          // console.log("2. increased");

          db.get(
            "SELECT inactivity_days FROM users WHERE user_id = ?",
            [member.user.id],
            (err, row) => {
              if (err)
                console.error(
                  "Błąd podczas pobierania informacji o użytkowniku:",
                  err
                );
              if (row && row.inactivity_days >= 7) {
                member.roles
                  .remove(role)
                  .then(() =>
                    console.log(
                      `Usunięto rolę ${role.name} od użytkownika ${member.user.tag}.`
                    )
                  )
                  .catch(console.error);
                resetUserInactivity(member.user.id);
              }
            }
          );
        }
      });
    });
  }, intervalInMilliseconds); // Sprawdzaj co minutę
}
