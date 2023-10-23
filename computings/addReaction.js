
module.exports = async (bot) => {
  const channel = await bot.channels.cache.get("1165725038608142439");
  // const msg = await channel.messages.fetch("1165609945710993408");
  const msg = await channel.messages.fetch("1166034084447932437");
  msg.react("✅");
  msg.react("❌");
};
