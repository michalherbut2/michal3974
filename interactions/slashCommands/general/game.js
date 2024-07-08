const { SlashCommandBuilder } = require("discord.js");
const convertData = require("../../../functions/format/convertData");
const formatTable = require("../../../functions/format/formatTable");
const getServerData = require("../../../functions/format/getServerData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gra")
    .setDescription("Pokazuje graczy, którzy są teraz na serwerze ftu fs22!"),
  async execute(interaction) {
    const data = await getServerData();
    const jsData = await convertData(data);
    const content = await formatTable(jsData);
    await interaction.reply(content);
  },
};
