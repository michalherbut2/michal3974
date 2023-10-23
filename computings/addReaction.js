module.exports = async (bot,channelId,messageId) => {
  const channel = await bot.channels.cache.get(channelId);
  const msg = await channel.messages.fetch(messageId);
  msg.react("✅");
  msg.react("❌");
};
