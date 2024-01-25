const convertData = require("../convertData.js");
const formatTable = require("../formatTable.js");
const getData = require("../getServerData.js");

module.exports = async client => {
  const updateTable = async () => {
    const channel = await client.channels.cache.get("1200134712644083824");
    const msg = await channel.messages.fetch("1200139100460699762");
    const data = await getData();
    const jsData = await convertData(data);
    const content = await formatTable(jsData);

    const guild = msg.guild;
    const totalMembers = guild.memberCount;

    const unverifiedRoleId = "1198761685998108753";
    const unverifiedRole = guild.roles.cache.get(unverifiedRoleId);
    const unverifiedMembers = unverifiedRole.members.size;

    const adminRoleId = "1008287145657647105";
    const adminRole = guild.roles.cache.get(adminRoleId);
    const admins = adminRole.members.size;

    msg.edit(`Ludzie na dc: ${totalMembers}\n Niezweryfikowani: ${unverifiedMembers}\n Admini: ${admins}` + content);
  };
  await updateTable();
  // milisecond*seconds*minutes*hours
  const time = 1000 * 60 * 5; // 5 min
  setInterval(updateTable, time);
}
