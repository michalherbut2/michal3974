const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../computings/messages/sendEmbed");
const ServerQueue = require("../../models/ServerQueue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("resetuje muzykę jak coś nie prądzi"),

  async execute(interaction) {
    client.queue.set(message.guild.id, new ServerQueue());

    sendEmbed(interaction, { description: `reset bota 🎵 ` });
  },
};
