const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../../functions/messages/sendEmbed");
const ServerQueue = require("../../../models/ServerQueue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unpause")
    .setDescription("odpauzowuje muzykę"),

  async execute(interaction) {
    client.queue.get(message.guild.id).player.unpause();

    sendEmbed(interaction, { description: `jazda 🎵` });
  },
};
