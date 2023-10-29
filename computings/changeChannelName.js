module.exports = (channel, data) => {
  const name = `serwer ${data.Server.Slots[0]["$"].numUsed} na ${data.Server.Slots[0]["$"].capacity}`;
  if (channel.name !== name) channel.setName(name);  
};
