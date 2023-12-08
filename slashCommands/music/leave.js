const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');
const { createWarningEmbed } = require("../../computings/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nara")
    .setDescription("Udaję się na spoczynek, Sir!"),
  async execute(interaction) {
    const serverQueue = interaction.client.queue.get(interaction.guild.id);
    serverQueue.queue = [];
    serverQueue.player.stop();

    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection)
      return await interaction.reply({embeds:[createWarningEmbed("Bot już udał się na spoczynek, Sir!")],ephemeral: true});
      
    connection.destroy();
    
    await interaction.reply("Udaję się na spoczynek, Sir!");
  },
};
