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
      await interaction.deferReply();

      const song = interaction.options.getString("muzyka");

      // Ensure the user is in a voice channel
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return await interaction.editReply({
          content: "Musisz być w kanale głosowym, aby użyć tej komendy!",
          ephemeral: true,
        });
      }

      // Create a voice connection
      const voiceConnection = createVoiceConnection(interaction);

      // Get the audio resource
      const audioResource = await getResource(song);

      // Play the music
      playMusic(interaction, audioResource, voiceConnection);

      await interaction.editReply({ content: `Odtwarzam teraz: ${song}` });
    } catch (error) {
      console.error("Problem:", error);
      await interaction.editReply({
        content: "Wystąpił błąd podczas próby odtworzenia muzyki.",
        embeds: [createWarningEmbed(error.message)],
        ephemeral: true,
      });
    }
  },
};