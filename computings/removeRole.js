module.exports = (interaction, userID, roleID) => {
  const member = interaction.guild.members.cache.get(userID);
  if (member) {
    if (!member.roles.cache.has(roleID)) {
      interaction.followUp("Nie masz już tej roli.");
    } else {
      const roleToAssign = interaction.guild.roles.cache.find(
        role => role.id === roleID
      );
      member.roles
        .remove(roleToAssign)
        .then(() => {
          console.log("nazwa roli do usunięcia:",roleToAssign.name);
          interaction.followUp(`Usunięto rolę ${roleToAssign?.name}!`);
        })
        .catch(error => {
          console.error("Role assignment error:", error);
          interaction.followUp(
            "Wystąpił problem podczas próby usunięcia roli."
          );
        });
    }
  }
};
