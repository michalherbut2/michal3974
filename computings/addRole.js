module.exports = async (interaction, userID, roleID) => {
  const member = interaction.guild.members.cache.get(userID);
  if (member) {
    if (member.roles.cache.has(roleID)) {
      // interaction.followUp("Masz już tę rolę.");
      return "Masz już tę rolę.";
    } else {
      const roleToAssign = interaction.guild.roles.cache.find(
        role => role.id === roleID
      );
      member.roles
        .add(roleToAssign)
        .then(() => {
          // interaction.followUp(`Dodano rolę ${roleToAssign?.name}!`);
          return `Dodano rolę ${roleToAssign?.name}!`;
        })
        .catch(error => {
          console.error("Role assignment error:", error);
          // interaction.followUp(
          //   "Wystąpił problem podczas próby przydzielenia roli."
          // );
          return "Wystąpił problem podczas próby przydzielenia roli.";
        });
    }
  }
};
