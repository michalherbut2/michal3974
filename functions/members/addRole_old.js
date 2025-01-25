module.exports = (message, userID) => {
  try {
    const member = message.guild.members.cache.get(userID);
    if (!member) {
      return message.channel.send("Nie znaleziono użytkownika.");
    }

    const roleID = "1162089947415711785";
    const roleToAssign = message.guild.roles.cache.get(roleID);

    if (!roleToAssign) {
      return message.channel.send("Nie znaleziono roli do przydzielenia.");
    }

    if (member.roles.cache.has(roleID)) {
      return message.channel.send("Masz już przyznaną tę rolę.");
    }

    member.roles.add(roleToAssign)
      .then(() => {
        message.channel.send(`Przyznano rolę ${roleToAssign.name}!`);
      })
      .catch(error => {
        console.error("Role assignment error:", error);
        message.channel.send("Wystąpił problem podczas próby przydzielenia roli.");
      });
  } catch (error) {
    console.error("Unexpected error:", error);
    message.channel.send("Wystąpił nieoczekiwany błąd.");
  }
};