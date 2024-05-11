const { createWarningEmbed } = require("./createEmbed");
const sendEmbed = require("./messages/sendEmbed");

module.exports = async (auditLog, guild, client) => {
  const config = client.config.get(guild.id);
  const logChannel = await client.channels.cache.get(config.kanal_do_kar);

  // Define your variables.
  const { action, executorId, targetId, changes, reason } = auditLog;

  // Check only for kicked users.
  if (changes[0]?.key !== "communication_disabled_until") return;

  // create a messages
  const addTimeoutMessage = `<@${targetId}> w końcu dostał przerwę od <@${executorId}> na <t:${parseInt(
    new Date(changes[0].new).getTime() / 1000
  )}:R> za **${reason ?? "darmo"}**.`;

  const removeTimeoutMessage = `<@${executorId}> niestety, jak zbój, pozbawił Czcigodnego <@${targetId}> jego zasłużonej przerwy.`;

  // choose the message
  const description = changes[0].new ? addTimeoutMessage : removeTimeoutMessage;

  // Now you can log the output!
  sendEmbed(logChannel, { description, color: "red" });
};
