const convertData = require("../../computings/convertData");
const formatTable = require("../../computings/formatTable");
const getServerData = require("../../computings/getServerData");

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