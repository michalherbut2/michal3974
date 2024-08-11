const { SlashCommandBuilder } = require("discord.js");
const createVoiceConnection = require("../../../functions/music/createVoiceConnection");
const playMusic = require("../../../functions/music/playMusic");
const sendEmbed = require("../../../functions/messages/sendEmbed");
const getResource = require("../../../functions/music/getResource");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play_plik")
    .setDescription("Gra piosenkę z pliku")
    .addAttachmentOption(option =>
      option.setName("plik").setDescription("plik z muzyką").setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      const voiceConnection = createVoiceConnection(interaction);

      const attachment = interaction.options.getAttachment("plik");
      console.log(attachment);

      if (
        !attachment.contentType.startsWith("video/mp4") &&
        !attachment.contentType.startsWith("audio/")
      )
        throw new Error("Proszę załączyć plik audio.");

      const resource = await getResource(attachment);

      playMusic(interaction, resource, voiceConnection);
    } catch (error) {
      console.error("Problem:", error);
      sendEmbed(interaction, { description: error.message, ephemeral: true });
    }
  },
};

