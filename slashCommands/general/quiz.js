const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// Command data
const commands = [
  {
    name: 'emote',
    description: 'Wyświetla informacje o emotce',
    options: [
      {
        name: 'opcja_wyszukiwania',
        type: 'STRING',
        description: 'Opcja wyszukiwania (ID, Nazwa, CzęśćNazwy, Wszystko)',
        required: true,
        choices: [
          { name: 'ID', value: 'id' },
          { name: 'Nazwa', value: 'nazwa' },
          { name: 'CzęśćNazwy', value: 'czescNazwy' },
          { name: 'Wszystko', value: 'wszystko' },
        ],
      },
      {
        name: 'wartosc_wyszukiwania',
        type: 'STRING',
        description: 'Wartość do wyszukania',
        required: true,
      },
    ],
  },
];

// REST setup
const rest = new REST({ version: '10' }).setToken('TwójTokenBota');

// Register commands
(async () => {
  try {
    console.log('Rozpoczynanie odświeżania komend...');

    // Replace 'YOUR_CLIENT_ID' with the actual client ID
    await rest.put(
      Routes.applicationCommands('YOUR_CLIENT_ID'),
      { body: commands },
    );

    console.log('Zaktualizowano komendy pomyślnie!');
  } catch (error) {
    console.error(error);
  }
})();




// Event handling
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, guildId } = interaction;

  if (commandName === 'emote') {
    const searchOption = options.getString('opcja_wyszukiwania');
    const searchValue = options.getString('wartosc_wyszukiwania');
    const emojis = findEmojis(client, guildId, searchOption, searchValue);

    if (emojis.length > 0) {
      emojis.sort((a, b) => b.matchScore - a.matchScore);

      const embed = {
        title: 'Wyniki wyszukiwania',
        fields: emojis.map((emoji) => ({
          name: `${emoji.type === 'emoji' ? 'Emoji' : 'Emotka niestandardowa'}: ${emoji.name}`,
          value: `ID: ${emoji.id}\nTrafność: ${emoji.matchScore}%`,
          inline: true,
        })),
        color: 0x3498db,
      };

      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply('Brak pasujących emotek!');
    }
  }
});

// Function to find emojis
function findEmojis(client, guildId, searchOption, searchValue) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return [];

  const emojis = guild.emojis.cache.array();

  const results = emojis
    .map((emoji) => {
      let matchScore = 0;

      switch (searchOption) {
        case 'id':
          if (emoji.id === searchValue) {
            matchScore = 100;
          }
          break;
        case 'nazwa':
          if (emoji.name.toLowerCase() === searchValue.toLowerCase()) {
            matchScore = 100;
          } else if (emoji.name.toLowerCase().includes(searchValue.toLowerCase())) {
            matchScore = 50;
          }
          break;
        case 'czescNazwy':
          if (emoji.name.toLowerCase().includes(searchValue.toLowerCase())) {
            matchScore = 50;
          }
          break;
        case 'wszystko':
          matchScore = 25;
          break;
      }

      return { ...emoji, matchScore };
    })
    .filter((result) => result.matchScore > 0);

  return results;
}

// Client login (to be done elsewhere in your code)
// client.login('YOUR_BOT_TOKEN');
