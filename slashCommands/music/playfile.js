const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("@discordjs/builders");

const player = createAudioPlayer();
let audioResource;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playfile")
    .setDescription("Play music from an attached MP3 file or a direct link to an MP3 file")
    .addStringOption((option) =>
      option
        .setName("file")
        .setDescription("Direct link to an MP3 file or attach an MP3 file to your message")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel)
        return interaction.reply({
          content: "Dołącz do kanału głosowego!",
          ephemeral: true,
        });

      const fileOption = interaction.options.getString("file");

      let mp3FilePath;

      // Check if the provided option is a valid URL
      if (/^https?:\/\/.*\.(mp3)$/i.test(fileOption)) {
        mp3FilePath = fileOption;
      } else {
        const attachedFiles = interaction.attachments.array();

        if (attachedFiles.length === 0 || !attachedFiles[0].name.endsWith(".mp3")) {
          return interaction.reply({
            content: "Proszę podać poprawny link do pliku MP3 lub dołączyć plik MP3 do swojej wiadomości.",
            ephemeral: true,
          });
        }

        mp3FilePath = attachedFiles[0].url;
      }

      // Create an audio resource
      audioResource = createAudioResource(mp3FilePath);

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      voiceConnection.subscribe(player);
      player.play(audioResource);

      // Event listener to detect when the playback ends
      player.on(AudioPlayerStatus.Idle, () => {
        voiceConnection.destroy();
      });

      interaction.reply({
        content: `Now playing: **${mp3FilePath}**`,
      });
    } catch (error) {
      console.error("Error:", error);
      interaction.reply({
        content: "An error occurred while playing the file.",
      });
    }
  },
};
