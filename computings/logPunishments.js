const { AuditLogEvent } = require("discord.js");
const { createWarningEmbed } = require("./createEmbed");

module.exports = async (auditLog, guild, client) => {
  const config = client.config.get(guild.id);
  const logChannel = await client.channels.cache.get(config.kanal_do_kar);

  // Define your variables.
  const { action, executorId, targetId, changes, reason } = auditLog;
  // Check only for kicked users.
  if (changes[0].key !== 'communication_disabled_until') return;

  let message = 'nic'

  switch (changes[0].key) {
    case 'communication_disabled_until':
      message = `<@${targetId}> w końcu dostał przerwę od <@${executorId}> na <t:${parseInt(new Date(changes[0].new).getTime()/1000)}:R> za **${reason ?? 'darmo'}**.`;
      break;
  
    default:
      break;
  }

  // Now you can log the output!
  logChannel.send({embeds:[createWarningEmbed(message)]})
};
