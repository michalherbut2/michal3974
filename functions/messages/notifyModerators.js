const { PermissionsBitField } = require("discord.js");

let isCooldown = false;
const voiceChannelId = "1198762609571278908";
const voiceChannelName = "✅┃weryfikacja";
const textChannelId = "1198763617986826360";
const textChannelName = "weryfikacja";
const moderatorRoleId = "1049729342420287508";
const adminRoldId = "1008287145657647105";
const slaveRoldId = "1205185517214236692";
const unverificatedRoleId = "1198761685998108753";
const unverificatedRoleName = "niezweryfikowany";
const cooldownTime = 60_000; // Cooldown time in milliseconds

module.exports = newState => {
  // Check if the user joined the specific voice channel
  // console.log(newState.channel?.name, voiceChannelName, newState.channel?.name !== voiceChannelName, isCooldown);
  
  if (newState.channel?.name !== voiceChannelName || isCooldown) return;
  console.log("sprawdzam czy masz rangę");
  
  const voiceChannel = newState.channel;

  // const member = newState.member;
  // Skip the verification for users with the moderator role
  // if (member && member.permissions.has(PermissionsBitField.Flags.BanMembers))
  //   return;

  // Check if there is already a verificated member in the verification channel
  if (
    voiceChannel &&
    voiceChannel.members.some(
      member => !member.roles.cache.find(r => r.name === unverificatedRoleName)
    )
  )
    return;
    console.log("sprawdzam czy masz kanała");

  isCooldown = true;
  setTimeout(() => (isCooldown = false), cooldownTime);

  // Get the text channel where you want to send the message
  const textChannel = newState.guild.channels.cache.find(
    c => c.name === textChannelName
  );

  // Check if the text channel exists
  if (textChannel) {
    // Send a message to the text channel
    const userId = newState.member.id;
    // textChannel.send(
    //   `test`
    // );
    textChannel.send(
      `### <@${userId}> wszedł na <#${voiceChannelId}> <t:${parseInt(
        new Date().getTime() / 1000
      )}:R>! <@&${adminRoldId}>, <@&${moderatorRoleId}> lub <@&${slaveRoldId}> idź go zweryfikować!`
    );
    console.log(
      `### ${userId} wszedł na <#${voiceChannelId}>! <@&{moderatorRoleId}> idź go zweryfikować!`
    );
  } else {
    console.error("Kanał tekstowy nie został znaleziony.");
  }
};
