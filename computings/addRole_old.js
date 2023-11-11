module.exports = (message, userID) => {
  const member = message.guild.members.cache.get(userID);
  if (member) {
    if (member.roles.cache.has("1162089947415711785")) {
      message.channel.send("Masz już przyznaną tę rolę.");
    } else {
      const roleToAssign = message.guild.roles.cache.find(
        role => role.id === "1162089947415711785"
      );
      member.roles
        .add(roleToAssign)
        .then(() => {
          message.channel.send(`Przyznano rolę ${roleToAssign.name}!`);
        })
        .catch(error => {
          console.error("Role assignment error:", error);
          message.channel.send(
            "Wystąpił problem podczas próby przydzielenia roli."
          );
        });
    }
  }
};
