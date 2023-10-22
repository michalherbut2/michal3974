module.exports = async (message, data) => {
  const name = `serwer ${data.Server.Slots[0]["$"].numUsed} na ${data.Server.Slots[0]["$"].capacity}`;
  message.channel.setName(name);
};
