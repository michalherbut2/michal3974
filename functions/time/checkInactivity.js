const incrementUserInactivity = require("./incrementUserInactivity");
const resetUserInactivity = require("./resetUserInactivity");
const betterSqlite3 = require("better-sqlite3");

module.exports = async (client, guildId) => {
  console.log("sprawdzam nieobecność w", guildId);
  const guild = client.guilds.cache.get(guildId);
  
  if (!guild) {
    console.error("Serwer nie został znaleziony.");
    return;
  }

  let db;
  try {
    db = new betterSqlite3(`db/db_${guildId}.db`);
  } catch (error) {
    console.error(`Nie udało się otworzyć bazy danych dla serwera ${guildId}:`, error);
    return;
  }

  const config = await client.config.get(guildId);
  if (!config) {
    console.error(`Konfiguracja nie została znaleziona dla serwera ${guildId}.`);
    return;
  }

  const role = guild.roles.cache.get(config.aktywna_rola);
  if (!role) {
    console.error("Rola nie została znaleziona.");
    return;
  }

  const commandsChannel = client.channels.cache.get(config.kanal_do_komend);
  if (!commandsChannel) {
    console.error("Kanał do komend nie został znaleziony.");
    return;
  }

  try {
    await commandsChannel.send("Dodano nieobecności adminom!");
    const members = await guild.members.fetch();
    members.forEach(async (member) => {
      const memberId = member.user.id;
      const hasRole = member.roles.cache.some((role) => role.id === config.aktywna_rola);
      
      if (hasRole) {
        try {
          incrementUserInactivity(memberId, db);

          const row = db.prepare("SELECT inactivity_num FROM inactivity WHERE user_id = ?").get(memberId);
          if (row && row.inactivity_num >= 7) {
            await member.roles.remove(role);
            console.log(`Usunięto rolę ${role.name} od użytkownika ${member.user.tag}.`);
            resetUserInactivity(memberId, db);
          }
        } catch (error) {
          console.error(`Błąd podczas przetwarzania użytkownika ${member.user.tag}:`, error);
        }
      }
    });
  } catch (error) {
    console.error(`Błąd podczas wysyłania wiadomości lub pobierania członków w serwerze ${guildId}:`, error);
  } finally {
    if (db) {
      db.close();
      console.log(`Baza danych zamknięta dla serwera ${guildId}.`);
    }
  }
};