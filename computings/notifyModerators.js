const { PermissionsBitField } = require("discord.js");

let isCooldown = false;
const verificationChannelId = "1198762609571278908";
const textChannelId = "1198763617986826360";
const moderatorRoleId = "1049729342420287508";
const adminRoldId = "1008287145657647105";
const cooldownTime = 60_000; // Cooldown time in milliseconds

module.exports = newState => {
  // Check if the user joined the specific voice channel
  if (newState.channelId !== verificationChannelId || isCooldown) return;

  const verificationChannel = newState.guild.channels.cache.get(
    verificationChannelId
  );

  // Check if there is already a moderator in the verification channel
  if (
    verificationChannel &&
    verificationChannel.members.some(member =>
      !member.roles.cache.has(moderatorRoleId)
    )
  )
    return;

  isCooldown = true;
  setTimeout(() => (isCooldown = false), cooldownTime);

  // Get the text channel where you want to send the message
  const textChannel =
    newState.guild.channels.cache.get(textChannelId);

  // Check if the text channel exists
  if (textChannel) {
    // Send a message to the text channel
    const userId = newState.member.id;
    textChannel.send(
      `### <@${userId}> wszedł na <#${verificationChannelId}> <t:${parseInt(
        new Date().getTime() / 1000
      )}:R>! <@&${adminRoldId}> lub <@&${moderatorRoleId}> idź go zweryfikować!`
    );
  } else {
    console.error("Kanał tekstowy nie został znaleziony.");
  }
};
