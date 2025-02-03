const sendEmbed = require("./sendEmbed");

module.exports = async (auditLog, guild, client) => {
  // const config = client.config.get(guild.id);
  // const logChannel = await client.channels.cache.get(config.kanal_do_kar);

  // Define your variables.
  const { action, executorId, targetId, changes, reason } = auditLog;

  // Check only for kicked users.
  if (changes[0]?.key !== "communication_disabled_until") return;

  // remove extra spaces between words
  cleanReason = reason?.replace(/\s+/g, ' ').trim();

  // create a messages
  const addTimeoutMessage = `<@${targetId}> w końcu **dostał przerwę** od <@${executorId}> na <t:${parseInt(
    new Date(changes[0].new).getTime() / 1000
  )}:R> za **${cleanReason?.trim() ?? "darmo"}**.`;

  const removeTimeoutMessage = `niestety <@${executorId}>, jak zbój, zasłużonej **pozbawił przerwy** Czcigodnego <@${targetId}>.`;

  // choose the message
  // const description = changes[0].new ? addTimeoutMessage : removeTimeoutMessage;
  // const color = changes[0].new ? "red" : "yellow";
  
  const options = {
    true: { description: addTimeoutMessage, color: "red" },
    false: { description: removeTimeoutMessage, color: "yellow" },
  };
  
  // const { description, color } = options[changes[0].new];

  const channel = guild.channels.cache.find(ch => ch.name.includes("bany"));
  // console.log(changes[0].new);
  
  // console.log(options[!!changes[0].new]);
  
  // Now you can log the output!
  // sendEmbed(channel, { description, color });
  sendEmbed(channel, options[!!changes[0].new]);
};
