const { PermissionsBitField } = require("discord.js");

let isCooldown = false;
const verificationChannelId = "1198762609571278908";
const adminChannelId = "1047156981686874172";
const moderatorRoleId = "1049729342420287508";
const adminRoldId = "1008287145657647105";
const cooldownTime = 60_000; // Cooldown time in milliseconds

module.exports = newState => {
  // Check if the user joined the specific voice channel
  if (newState.channelId !== verificationChannelId || isCooldown) return;

  const verificationChannel = newState.guild.channels.cache.get(
    verificationChannelId
  );

  // const member = newState.member;
  // Skip the verification for users with the moderator role
  // if (member && member.permissions.has(PermissionsBitField.Flags.BanMembers))
  //   return;

  // Check if there is already a moderator in the verification channel
  if (
    verificationChannel &&
    verificationChannel.members.some(member =>
      // member.permissions.has(PermissionsBitField.Flags.BanMembers)
      !member.roles.cache.has('1198761685998108753')
    )
  )
    return;

  isCooldown = true;
  setTimeout(() => (isCooldown = false), cooldownTime);

  // Get the text channel where you want to send the message
  const adminChannel =
    newState.guild.channels.cache.get(adminChannelId);

  // Check if the text channel exists
  if (adminChannel) {
    // Send a message to the text channel
    const userId = newState.member.id;
    adminChannel.send(
      `### <@${userId}> wszedł na <#${verificationChannelId}> <t:${parseInt(
        new Date().getTime() / 1000
      )}:R>! <@&${adminRoldId}> lub <@&${moderatorRoleId}> idź go zweryfikować!`
    );
    // console.log(
    //   `### ${userId} wszedł na <#${verificationChannelId}>! <@&{moderatorRoleId}> idź go zweryfikować!`
    // );
  } else {
    console.error("Kanał tekstowy nie został znaleziony.");
  }
};
