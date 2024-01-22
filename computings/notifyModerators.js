let isCooldown = false;
const verificationChannelId = "1198762609571278908";
const moderatorChannelId = "1198719827020370001";
const moderatorRoleId = "1049729342420287508";
const cooldownTime = 60_000; // Czas w milisekundach

module.exports = newState => {
  // Sprawdzanie, czy użytkownik wszedł na konkretny kanał głosowy
  if (newState.channelId !== verificationChannelId || isCooldown) return;

  const verificationChannel = newState.guild.channels.cache.get(
    verificationChannelId
  );
  if (
    verificationChannel &&
    verificationChannel.members.some(member =>
      member.roles.cache.has(moderatorRoleId)
    )
  )
    return;

  isCooldown = true;
  setTimeout(() => (isCooldown = false), cooldownTime);

  // Pobierz kanał tekstowy, na którym chcesz wysłać wiadomość
  const moderatorChannel =
    newState.guild.channels.cache.get(moderatorChannelId);

  // Sprawdź, czy kanał tekstowy istnieje
  if (moderatorChannel) {
    // Wyślij wiadomość na kanał tekstowy
    const userId = newState.member.id;

    // Wyślij wiadomość na kanał tekstowy z nazwą użytkownika
    moderatorChannel.send(`# <@${userId}> wszedł na <#1198762609571278908>! <@1049729342420287508> idź go zweryfikować!`);
    // console.log(
    //   `# ${userId} wszedł na <#${verificationChannelId}>! <@${moderatorRoleId}> idź go zweryfikować!`
    // );
  } else {
    console.error("Kanał tekstowy nie został znaleziony.");
  }
};
