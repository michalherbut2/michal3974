const sendEmbed = require("./sendEmbed");

module.exports = async (auditLog, guild, client) => {
  try {
    // Define your variables.
    const { action, executorId, targetId, changes, reason } = auditLog;

    // Check only for kicked users with a timeout change.
    if (!changes[0] || changes[0].key !== "communication_disabled_until") return;

    // Create messages for adding and removing timeouts.
    const addTimeoutMessage = `<@${targetId}> w końcu dostał przerwę od <@${executorId}> na <t:${Math.floor(
      new Date(changes[0].new).getTime() / 1000
    )}:R> za **${reason?.trim() ?? "darmo"}**.`;

    const removeTimeoutMessage = `<@${executorId}> niestety, jak zbój, pozbawił Czcigodnego <@${targetId}> jego zasłużonej przerwy.`;

    // Choose the appropriate message based on the change.
    const description = changes[0].new ? addTimeoutMessage : removeTimeoutMessage;

    // Find the channel to send the message.
    const channel = guild.channels.cache.find(ch => ch.name.includes("bany"));
    if (!channel) {
      throw new Error("Ban channel not found.");
    }

    // Send the embed message.
    await sendEmbed(channel, { description, color: "red" });
  } catch (error) {
    console.error("Error processing audit log:", error);
  }
};