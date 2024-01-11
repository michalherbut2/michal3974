const { SlashCommandBuilder } = require("discord.js");
const { createEmbed } = require("../../computings/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Tworzy głosowanie!")
    .addStringOption(option =>
      option
        .setName("opis")
        .setDescription("Opis tego, na co chcesz przeprowadzić głosowanie")
        .setRequired(true)
    ),
  async execute(interaction) {
    const content = "# 📊 " + interaction.options.getString("opis");
    const message = await interaction.reply({ content, fetchReply: true });
    await message.react("1011298488149098546");
    await message.react("👎");
  },
};
