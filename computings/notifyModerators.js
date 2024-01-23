let isCooldown = false;
const verificationChannelId = "1198762609571278908";
const moderatorChannelId = "1198719827020370001";
const moderatorRoleId = "1049729342420287508";
const cooldownTime = 60_000; // Cooldown time in milliseconds

module.exports = newState => {
  // Check if the user joined the specific voice channel
  if (newState.channelId !== verificationChannelId || isCooldown) return;

  const verificationChannel = newState.guild.channels.cache.get(
    verificationChannelId
  );

  const member = newState.member;
  // Skip the verification for users with the moderator role
  if (member && member.roles.cache.has(moderatorRoleId)) return;

  // Check if there is already a moderator in the verification channel
  if (
    verificationChannel &&
    verificationChannel.members.some((member) =>
      member.roles.cache.has(moderatorRoleId)
    )
  )
    return;

  isCooldown = true;
  setTimeout(() => (isCooldown = false), cooldownTime);

  // Get the text channel where you want to send the message
  const moderatorChannel = newState.guild.channels.cache.get(moderatorChannelId);

  // Check if the text channel exists
  if (moderatorChannel) {
    // Send a message to the text channel
    const userId = member.id;
    moderatorChannel.send(`### <@${userId}> wszedł na <#${verificationChannelId}> <t:${parseInt(new Date().getTime/1000)}:R>! <@&${moderatorRoleId}> idź go zweryfikować!`);
    // console.log(
    //   `### ${userId} wszedł na <#${verificationChannelId}>! <@&{moderatorRoleId}> idź go zweryfikować!`
    // );
  } else {
    console.error("Kanał tekstowy nie został znaleziony.");
  }
};