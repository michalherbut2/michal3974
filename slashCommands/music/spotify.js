const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const spdl = require('spdl-core');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

// Zastąp poniższe wartości swoimi prawdziwymi danymi lub użyj zmiennych środowiskowych
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.BOT_TOKEN;

// Komenda Spotify
const spotifyCommand = {
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Odtwarzaj muzykę ze Spotify')
    .addStringOption(option =>
      option
        .setName('spotifyinput')
        .setDescription('Link lub zapytanie wyszukiwania na Spotify')
        .setRequired(true)),
  execute: async (interaction, guildId, options) => {
    const spotifyInput = options.getString('spotifyinput');

    try {
      const isPlaylist = spdl.isPlaylist(spotifyInput);
      const trackList = isPlaylist ? await spdl.getTracks(spotifyInput) : [await spdl.getInfo(spotifyInput)];

      if (!trackList.length) {
        throw new Error('Nie znaleziono utworów.');
      }

      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply({
          content: 'Dołącz do kanału głosowego!',
          ephemeral: true,
        });
      }

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      for (const trackInfo of trackList) {
        const audioResource = createAudioResource(trackInfo.audio, { inlineVolume: true });

        voiceConnection.subscribe(player);
        player.play(audioResource);

        // Słuchacz zdarzeń do wykrywania zakończenia odtwarzania
        await new Promise((resolve) => {
          player.once(AudioPlayerStatus.Idle, () => {
            resolve();
          });
        });
      }

      voiceConnection.destroy();

      interaction.reply({
        content: `Teraz odtwarzane: ${isPlaylist ? 'Playlista' : 'Utwór'} - **${trackList[0].title}** wykonawcy **${trackList[0].artists.join(', ')}**`,
      });
    } catch (error) {
      console.error('Błąd:', error);
      interaction.reply({
        content: `Wystąpił błąd: ${error.message}`,
      });
    }
  },
};

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Rozpoczęto odświeżanie komend aplikacji (/).');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [spotifyCommand.data.toJSON()] },
    );

    console.log('Pomyślnie odświeżono komendy aplikacji (/).');
  } catch (error) {
    console.error(error);
  }
})();
