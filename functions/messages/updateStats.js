const convertData = require("../format/convertData.js");
const formatTable = require("../format/formatTable.js");
const getData = require("../format/getServerData.js");

const unverifiedRoleId = "1198761685998108753";
const adminRoleId = "1008287145657647105";
const statsChannelId = "1200134712644083824";
const statsMessageId = "1200139100460699762";

module.exports = async (client) => {
  const updateStats = async () => {
    try {
      const channel = client.channels.cache.get(statsChannelId);
      if (!channel) {
        console.error(`Channel with ID ${statsChannelId} not found.`);
        return;
      }

      const msg = await channel.messages.fetch(statsMessageId).catch((error) => {
        console.error(`Failed to fetch message with ID ${statsMessageId}:`, error);
        return null;
      });

      if (!msg) {
        console.error(`Message with ID ${statsMessageId} not found.`);
        return;
      }

      const data = await getData().catch((error) => {
        console.error("Failed to get data:", error);
        return null;
      });

      if (!data) {
        console.error("No data received from getData.");
        return;
      }

      const jsData = await convertData(data).catch((error) => {
        console.error("Failed to convert data:", error);
        return null;
      });

      if (!jsData) {
        console.error("No data received from convertData.");
        return;
      }

      const content = await formatTable(jsData).catch((error) => {
        console.error("Failed to format table:", error);
        return null;
      });

      if (!content) {
        console.error("No content received from formatTable.");
        return;
      }

      const guild = msg.guild;
      const totalMembers = guild.memberCount;

      await guild.members.fetch();
      const unverifiedRole = await guild.roles.fetch(unverifiedRoleId).catch((error) => {
        console.error(`Failed to fetch role with ID ${unverifiedRoleId}:`, error);
        return null;
      });

      const unverifiedMembers = unverifiedRole?.members?.size || 0;

      const adminRole = guild.roles.cache.get(adminRoleId);
      const admins = adminRole?.members.size || 0;

      await msg.edit(`:busts_in_silhouette: **Ludzie na dc:** ${totalMembers}\n
:grey_question: **Niezweryfikowani:** ${unverifiedMembers}\n
:shield: **Admini:** ${admins}`).catch((error) => {
        console.error("Failed to edit message:", error);
      });

    } catch (error) {
      console.error("Error during updateStats execution:", error);
    }
  };

  try {
    await updateStats();
  } catch (error) {
    console.error("Initial updateStats execution failed:", error);
  }

  // Schedule periodic updates every 5 minutes
  const intervalTime = 1000 * 60 * 5; // 5 minutes
  setInterval(async () => {
    try {
      await updateStats();
    } catch (error) {
      console.error("Periodic updateStats execution failed:", error);
    }
  }, intervalTime);
};