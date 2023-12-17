const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("@discordjs/builders");

const player = createAudioPlayer();
let audioResource;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playfile")
    .setDescription("Odtwórz muzykę z załączonego pliku MP3")
    .addStringOption((option) =>
      option
        .setName("file")
        .setDescription("Załącz plik MP3 do wiadomości")
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

      // Utwórz zasób audio
      audioResource = createAudioResource(fileOption);

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      // Sprawdź i zatrzymaj poprzednią piosenkę
      if (audioResource) {
        audioResource.stop();
      }

      // Podłącz zasób audio do odtwarzacza
      voiceConnection.subscribe(player);
      player.play(audioResource);

      // Nasłuchuj zdarzenia zakończenia odtwarzania
      player.on(AudioPlayerStatus.Idle, () => {
        voiceConnection.destroy();
      });

      interaction.reply({
        content: `Odtwarzam muzykę z pliku: **${fileOption}**`,
      });
    } catch (error) {
      console.error("Błąd:", error);
      interaction.reply({
        content: "Wystąpił błąd podczas odtwarzania muzyki.",
      });
    }
  },
};
