const { SlashCommandBuilder } = require("discord.js");
const getResource = require("../../../functions/music/getResource");
const createVoiceConnection = require("../../../functions/music/createVoiceConnection");
const playMusic = require("../../../functions/music/playMusic");
const sendEmbed = require("../../../functions/messages/sendEmbed");
const getResourceOld = require("../../../functions/music/getResourceOld");

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
      await interaction.deferReply();

      const voiceConnection = createVoiceConnection(interaction);

      const song = interaction.options.getString("muzyka");

      const audioResource = await getResource(song);
      // const audioResource = await getResourceOld(song);
      // console.log("audioResource", audioResource);
      playMusic(interaction, audioResource, voiceConnection);
    } catch (error) {
      console.error("Problem:", error);
      sendEmbed(interaction, {description: error.message, ephemeral: true})
    }
  },
};
