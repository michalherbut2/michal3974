module.exports = async (interaction, userId) => {
  try {
    const guildMember = await interaction.guild.members.fetch(userId);

    // Check if the guild member exists
    if (!guildMember) {
      console.error("Użytkownik nie został znaleziony.");
      return "Nie znaleziono użytkownika.";
    }

    // Return the display name of the guild member
    return guildMember.displayName;
  } catch (error) {
    console.error("Błąd podczas pobierania użytkownika:", error);
    return "Wystąpił problem podczas pobierania użytkownika.";
  }
};