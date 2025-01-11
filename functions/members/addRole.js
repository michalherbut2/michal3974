module.exports = async (interaction, userId, roleId) => {
  try {
    const guild = interaction.guild;
    const channel = interaction.channel;
    const member = guild.members.cache.get(userId);
    const roleToAssign = guild.roles.cache.get(roleId);

    if (!roleToAssign) {
      console.error("Rola nie została znaleziona.");
      return channel.send("Nie znaleziono roli do przydzielenia.");
    }

    if (!member) {
      console.error("Użytkownik nie został znaleziony.");
      return channel.send("Nie znaleziono użytkownika.");
    }

    if (member.roles.cache.has(roleId)) {
      return channel.send("Masz już tę rolę.");
    } else {
      await member.roles.add(roleToAssign);
      channel.send(`Dodano rolę ${roleToAssign.name}!`);
    }
  } catch (error) {
    console.error("Error during role assignment:", error);
    interaction.channel.send("Wystąpił problem podczas próby przydzielenia roli.");
  }
};