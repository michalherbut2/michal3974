module.exports = async (interaction, userID, roleID) => {
  try {
    const member = interaction.guild.members.cache.get(userID);
    if (!member) {
      console.error("Użytkownik nie został znaleziony.");
      return interaction.followUp("Nie znaleziono użytkownika.");
    }

    if (!member.roles.cache.has(roleID)) {
      return interaction.followUp("Nie masz tej roli.");
    }

    const roleToAssign = interaction.guild.roles.cache.get(roleID);
    if (!roleToAssign) {
      console.error("Rola nie została znaleziona.");
      return interaction.followUp("Nie znaleziono roli do usunięcia.");
    }

    await member.roles.remove(roleToAssign);
    console.log("Nazwa roli do usunięcia:", roleToAssign.name);
    interaction.followUp(`Usunięto rolę ${roleToAssign.name}!`);
  } catch (error) {
    console.error("Role removal error:", error);
    interaction.followUp("Wystąpił problem podczas próby usunięcia roli.");
  }
};