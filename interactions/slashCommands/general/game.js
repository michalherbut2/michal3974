const { SlashCommandBuilder } = require("discord.js");
const convertData = require("../../../functions/format/convertData");
const formatTable = require("../../../functions/format/formatTable");
const getServerData = require("../../../functions/format/getServerData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gra")
    .setDescription("Pokazuje graczy, którzy są teraz na serwerze ftu fs22!"),
  
  async execute(interaction) {
    try {
      // Fetch server data
      const data = await getServerData();
      
      // Convert data to JavaScript object
      const jsData = await convertData(data);

      // Format data into a table
      const content = await formatTable(jsData);

      // Reply with the formatted content
      await interaction.reply(content);
      
    } catch (error) {
      console.error("Error executing gra command:", error);

      // Send an error message to the user
      await interaction.reply({
        content: `Wystąpił błąd przy wykonywaniu polecenia: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};