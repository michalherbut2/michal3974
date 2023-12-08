const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Kończy granie muzyki!"),
  async execute(interaction) {
    const serverQueue = interaction.client.queue.get(interaction.guild.id)
    serverQueue.queue = [];
    serverQueue.player.stop();
    await interaction.reply("Skończył się dzień dziecka!");
  },
};