const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Kończy granie muzyki!"),
  async execute(interaction) {
    interaction.client.queue.get(interaction.guild.id).queue = [];
    interaction.client.queue.get(interaction.guild.id).player.stop();
    await interaction.reply("Skończył się dzień dziecka!");
  },
};
// syf