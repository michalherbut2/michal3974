const { PermissionsBitField } = require("discord.js");

let isCooldown = false;
const voiceChannelId = "1198762609571278908";
const voiceChannelName = "✅┃weryfikacja";
const textChannelId = "1198763617986826360";
const textChannelName = "weryfikacja";
const moderatorRoleId = "1049729342420287508";
const adminRoleId = "1008287145657647105";
const slaveRoleId = "1205185517214236692";
const unverificatedRoleId = "1198761685998108753";
const unverificatedRoleName = "niezweryfikowany";
const cooldownTime = 60_000; // Cooldown time in milliseconds

module.exports = newState => {
  try {
    // Check if the user joined the specific voice channel and if cooldown is active
    if (!newState.channel || newState.channel.name !== voiceChannelName || isCooldown) return;
    console.log("sprawdzam czy masz rangę");

    const voiceChannel = newState.channel;
    const member = newState.member;

    // Skip the verification for users with the moderator or admin role
    if (member && member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return;
    }

    // Check if there is already a verified member in the verification channel
    if (voiceChannel.members.some(member => !member.roles.cache.has(unverificatedRoleId))) {
      return;
    }
    console.log("sprawdzam czy masz kanała");

    // Set cooldown
    isCooldown = true;
    setTimeout(() => (isCooldown = false), cooldownTime);

    // Get the text channel where you want to send the message
    const textChannel = newState.guild.channels.cache.find(c => c.name === textChannelName);

    // Check if the text channel exists
    if (textChannel) {
      const userId = newState.member.id;
      const message = `### <@${userId}> wszedł na <#${voiceChannelId}> <t:${Math.floor(
        Date.now() / 1000
      )}:R>! <@&${adminRoleId}>, <@&${moderatorRoleId}> lub <@&${slaveRoleId}> idź go zweryfikować!`;
      textChannel.send(message);
      console.log(`Sent verification message for user ${userId}`);
    } else {
      console.error("Kanał tekstowy nie został znaleziony.");
    }
  } catch (error) {
    console.error("Error processing voice state update:", error);
  }
};