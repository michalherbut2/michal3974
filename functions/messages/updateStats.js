const convertData = require("../format/convertData.js");
const formatTable = require("../format/formatTable.js");
const getData = require("../format/getServerData.js");

const unverifiedRoleId = "1198761685998108753";
const adminRoleId = "1008287145657647105";
const statsChannel = "1200134712644083824";

module.exports = async client => {
  const updateStats = async () => {
    const channel = await client.channels.cache.get(statsChannel);
    const msg = await channel.messages.fetch("1200139100460699762");
    const data = await getData();
    const jsData = await convertData(data);
    const content = await formatTable(jsData);

    const guild = msg.guild;
    const totalMembers = guild.memberCount;

    await guild.members.fetch();
    const unverifiedRole = await guild.roles.fetch(unverifiedRoleId);
    const unverifiedMembers = unverifiedRole?.members?.size;

    const adminRole = guild.roles.cache.get(adminRoleId);
    const admins = adminRole.members.size;

    msg.edit(`:busts_in_silhouette: **Ludzie na dc:** ${totalMembers}\n
:grey_question: **Niezweryfikowani:** ${unverifiedMembers}\n
:shield: **Admini:** ${admins}`);
  };
  await updateStats();
  // milisecond*seconds*minutes*hours
  const time = 1000 * 60 * 5; // 5 min
  setInterval(updateStats, time);
};
