const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Pomija jedną piosenkę"),
  async execute(interaction) {
    const serverQueue = interaction.client.queue.get(interaction.guild.id);
    serverQueue.isLooping ^= true;
    const message=serverQueue.isLooping?"jeszcze raz":"dosc"
    await interaction.reply(message);
    
  },
};
