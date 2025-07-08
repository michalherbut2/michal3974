// logKick.js
const sendEmbed = require("./sendEmbed");

module.exports = async (auditLog, guild, client) => {
  // const config = client.config.get(guild.id);
  // const logChannel = await client.channels.cache.get(config.kanal_do_kar);

  // Define your variables.
  const { executorId, targetId, reason } = auditLog;

  // Check if this is a kick action (no changes array for kicks unlike timeouts)
  // Kicks are typically identified by the action type in the audit log
  
  // Remove extra spaces between words
  const cleanReason = reason?.replace(/\s+/g, ' ').trim();

  // Create the kick message
  const kickMessage = `<@${targetId}> na szczęście został **wygnany** z serwera przez <@${executorId}> za **${cleanReason?.trim() ?? "darmo"}**.`;

  const options = {
    description: kickMessage,
    color: "orange"
  };

  const channel = guild.channels.cache.find(ch => ch.name.includes("bany"));

  // Log the kick
  sendEmbed(channel, options);
};