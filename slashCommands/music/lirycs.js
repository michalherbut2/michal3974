const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const axios = require('axios');
const cheerio = require('cheerio');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageEmbed } = require('discord.js');

const player = createAudioPlayer();

const commands = [
  {
    name: 'lyrics',
    description: 'Pokaż tekst piosenki',
    options: [
      {
        name: 'title',
        type: 'STRING',
        description: 'Tytuł piosenki',
        required: false,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken('YOUR_BOT_TOKEN');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands('YOUR_CLIENT_ID', 'YOUR_GUILD_ID'),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

const interactionHandler = async (interaction) => {
  if (!interaction.isCommand()) return;

  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    return interaction.reply({ content: 'Dołącz do kanału głosowego!', ephemeral: true });
  }

  const guildId = interaction.guild.id;
  const channelId = voiceChannel.id;

  try {
    const voiceConnection = joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    voiceConnection.subscribe(player);

    let songTitle;
    const titleOption = interaction.options.getString('title');
    if (titleOption) {
      songTitle = titleOption;
    } else {
      songTitle = getSongTitleFromStream(voiceConnection);

      if (!songTitle) {
        return interaction.reply({ content: 'Nie mogę uzyskać tytułu piosenki.', ephemeral: true });
      }
    }

    const lyrics = await getLyrics(songTitle);

    if (!lyrics) {
      return interaction.reply({ content: 'Nie znaleziono tekstu dla tej piosenki.', ephemeral: true });
    }

    const embed = new MessageEmbed()
      .setTitle(`Tekst piosenki: ${songTitle}`)
      .setDescription(`\`\`\`${lyrics}\`\`\``)
      .setColor('#3498db');

    interaction.reply({ embeds: [embed], ephemeral: true });

    // Event listener to detect when the playback ends
    await new Promise((resolve) => {
      player.once(AudioPlayerStatus.Idle, () => {
        voiceConnection.destroy();
        resolve();
      });
    });
  } catch (error) {
    console.error('Error:', error);
    interaction.reply({ content: 'Wystąpił błąd podczas uzyskiwania tekstu piosenki.', ephemeral: true });
  }
};

// Przykładowe wywołanie obsługi interakcji
const exampleInteraction = {
  isCommand: () => true,
  member: {
    voice: {
      channel: {
        id: 'VOICE_CHANNEL_ID',
      },
    },
  },
  guild: {
    id: 'GUILD_ID',
  },
  commandName: 'lyrics',
  options: {
    getString: (name) => {
      // Tutaj możesz dostarczyć opcje dla testowania
      if (name === 'title') {
        return 'Some Song Title';
      }
      return null;
    },
  },
  reply: (message) => console.log(message),
};

// Event listener dla interakcji
interactionHandler(exampleInteraction);

// Funkcja pobierająca tytuł z aktualnie odtwarzanej piosenki
const getSongTitleFromStream = (voiceConnection) => {
  const session = voiceConnection.joinConfig.sessionId;
  const audioPlayer = voiceConnection.state.audioPlayer;

  if (!audioPlayer || !session) {
    return null;
  }

  const state = audioPlayer.state;
  const dispatcher = state.subscriptions.get(session);

  if (!dispatcher) {
    return null;
  }

  const resource = dispatcher.resource;
  if (!resource) {
    return null;
  }

  const metadata = resource.metadata;
  if (!metadata) {
    return null;
  }

  return metadata.title;
};

// Funkcja pobierająca tekst piosenki
const getLyrics = async (title) => {
  try {
    const searchUrl = `https://genius.com/api/search/multi?q=${encodeURIComponent(title)}`;
    const response = await axios.get(searchUrl);

    const hit = response.data.response.sections[0].hits[0].result;
    const lyricsUrl = `https://genius.com${hit.url}`;

    const lyricsResponse = await axios.get(lyricsUrl);
    const $ = cheerio.load(lyricsResponse.data);
    const lyrics = $('.lyrics').text().trim();

    return lyrics || null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
