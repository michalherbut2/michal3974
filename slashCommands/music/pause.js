const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../computings/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Stopuje piosenkę"),
    
  async execute(interaction) {
    interaction.client.queue.get(message.guild.id).player.pause();

    sendEmbed(interaction, { description: `halt 🎵` });
  },
};

