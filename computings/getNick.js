module.exports = async (interaction, userId) => {
  const guildMember = await interaction.guild.members.fetch(userId);
  return guildMember?.displayName;
};