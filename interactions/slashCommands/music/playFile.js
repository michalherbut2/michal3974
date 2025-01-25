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

      // Ensure the user is in a voice channel
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return await interaction.editReply({
          content: "Musisz być w kanale głosowym, aby użyć tej komendy!",
          ephemeral: true,
        });
      }

      const voiceConnection = createVoiceConnection(interaction);

      const attachment = interaction.options.getAttachment("plik");

      if (!attachment.contentType.startsWith("audio/") && !attachment.contentType.startsWith("video/mp4")) {
        throw new Error("Proszę załączyć plik audio.");
      }

      const resource = await getResource(attachment);

      playMusic(interaction, resource, voiceConnection);
      await interaction.editReply({ content: `Odtwarzam teraz plik muzyczny: ${attachment.name}` });
    } catch (error) {
      console.error("Problem:", error);
      await sendEmbed(interaction, { description: `Wystąpił błąd: ${error.message}`, ephemeral: true });
    }
  },
};