const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const spdl = require('spdl-core');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const clientId = 'YOUR_CLIENT_ID';
const guildId = 'YOUR_GUILD_ID';
const token = 'YOUR_BOT_TOKEN';

const commands = [
  {
    name: 'spotify',
    description: 'Play music from Spotify',
    options: [
      {
        name: 'spotifyinput',
        type: 'STRING',
        description: 'Spotify link or search query',
        required: true,
      },
    ],
  },
  {
    name: 'playspotify',
    description: 'Play music from Spotify',
    options: [
      {
        name: 'link',
        type: 'STRING',
        description: 'Spotify link or search query',
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(token);

const player = createAudioPlayer();
let audioResource;

async function playMusic(interaction, guildId) {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'spotify' || commandName === 'playspotify') {
    const spotifyInput = options.getString('spotifyinput') || options.getString('link');

    try {
      const isPlaylist = spdl.isPlaylist(spotifyInput);
      const trackList = isPlaylist ? await spdl.getTracks(spotifyInput) : [await spdl.getInfo(spotifyInput)];

      if (!trackList.length) {
        throw new Error('No tracks found.');
      }

      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply({
          content: 'Join a voice channel!',
          ephemeral: true,
        });
      }

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      for (const trackInfo of trackList) {
        audioResource = createAudioResource(trackInfo.audio, { inlineVolume: true });

        voiceConnection.subscribe(player);
        player.play(audioResource);

        // Event listener to detect when the playback ends
        await new Promise((resolve) => {
          player.once(AudioPlayerStatus.Idle, () => {
            resolve();
          });
        });
      }

      voiceConnection.destroy();

      interaction.reply({
        content: `Now playing: ${isPlaylist ? 'Playlist' : 'Track'} - **${trackList[0].title}** by **${trackList[0].artists.join(', ')}**`,
      });
    } catch (error) {
      console.error('Error:', error);
      interaction.reply({
        content: `An error occurred: ${error.message}`,
      });
    }
  }
}

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Możesz dodać kod inicjalizacji, jeśli to konieczne, np. w przypadku używania innych funkcji w tym pliku
