module.exports = (channel, data) => {
  const name = `serwer ${data.Server.Slots[0]["$"].numUsed} na ${data.Server.Slots[0]["$"].capacity}`;
  channel.setName(name);
};
