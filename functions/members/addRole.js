module.exports = async (interaction, userId, roleId) => {
  const guild = interaction.guild
  const channel = interaction.channel
  const member = guild.members.cache.get(userId);
  const roleToAssign = guild.roles.cache.get(roleId);

  if (!roleToAssign) {
    console.error("Rola nie została znaleziona.");
    return;
  }
  if (member) {
    if (member.roles.cache.has(roleId)) {
      channel.send("Masz już tę rolę.");
    } else {
      member.roles
        .add(roleToAssign)
        .then(() => {
          channel.send(`Dodano rolę ${roleToAssign?.name}!`);
        })
        .catch(error => {
          channel.send("Wystąpił problem podczas próby przydzielenia roli.");
          console.error("Role assignment error:", error);
        });
    }
  }
};
