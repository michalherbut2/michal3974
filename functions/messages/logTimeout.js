const sendEmbed = require("./sendEmbed");
const saveTimeout = require("../database/saveTimeout");

module.exports = async (auditLog, guild, client) => {
  // const config = client.config.get(guild.id);
  // const logChannel = await client.channels.cache.get(config.kanal_do_kar);

  // Define your variables.
  const { executorId, targetId, changes, reason } = auditLog;

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

  // Determine if this is adding or removing a timeout
  const isAddingTimeout = !!changes[0].new;
  const action = isAddingTimeout ? "add" : "remove";
  console.log(action);
  
  
  // Get duration (for adding timeout)
  let duration = "";
  if (isAddingTimeout && changes[0].new) {
    // Calculate duration from the timestamp
    const timeoutUntil = new Date(changes[0].new);
    const now = new Date();
    const durationMs = timeoutUntil - now;
    
    // Convert to human-readable format
    const minutes = Math.floor(durationMs / 60000);
    if (minutes < 60) {
      duration = `${minutes} minut`;
    } else if (minutes < 1440) {
      duration = `${Math.floor(minutes / 60)} godzin`;
    } else {
      duration = `${Math.floor(minutes / 1440)} dni`;
    }
  }
  
  const options = {
    true: { description: addTimeoutMessage, color: "red" },
    false: { description: removeTimeoutMessage, color: "yellow" },
  };
  
  // const { description, color } = options[changes[0].new];

  const channel = guild.channels.cache.find(ch => ch.name.includes("bany"));

  await saveTimeout(guild.id, targetId, executorId, cleanReason, duration, action);

  // console.log(changes[0].new);
  
  // console.log(options[!!changes[0].new]);
  
  // Now you can log the output!
  // sendEmbed(channel, { description, color });
  sendEmbed(channel, options[isAddingTimeout]);
};
