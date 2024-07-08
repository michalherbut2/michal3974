const { SlashCommandBuilder } = require("discord.js");
const getResource = require("../../../functions/music/getResource");
const createVoiceConnection = require("../../../functions/music/createVoiceConnection");
const playMusic = require("../../../functions/music/playMusic");
const sendEmbed = require("../../../functions/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Gra piosenkę z yt")
    .addStringOption(option =>
      option
        .setName("muzyka")
        .setDescription("nazwa piosenki lub link yt")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // interaction.deferReply();

      const voiceConnection = createVoiceConnection(interaction);

      const song = interaction.options.getString("muzyka");

      const audioResource = await getResource(song);

      playMusic(interaction, audioResource, voiceConnection);
    } catch (error) {
      console.error("Problem:", error);
      sendEmbed(interaction, {description: error.message, ephemeral: true})
    }
  },
};
