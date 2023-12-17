// main.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { SlashCommandBuilder } = require('@discordjs/builders');

// Function to find emojis
function findEmojis(guildId, searchOption, searchValue, client) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return [];

  const emojis = guild.emojis.cache.array();

  const results = emojis.map((emoji) => {
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
  }).filter((result) => result.matchScore > 0);

  return results;
}

// Command object for 'emote'
module.exports = {
  data: new SlashCommandBuilder()
    .setName('emote')
    .setDescription('Wyświetla informacje o emotce')
    .addStringOption(option =>
      option
        .setName('opcja_wyszukiwania')
        .setDescription('Opcja wyszukiwania (ID, Nazwa, CzęśćNazwy, Wszystko)')
        .setRequired(true)
        .addChoice('ID', 'id')
        .addChoice('Nazwa', 'nazwa')
        .addChoice('CzęśćNazwy', 'czescNazwy')
        .addChoice('Wszystko', 'wszystko')
    )
    .addStringOption(option =>
      option
        .setName('wartosc_wyszukiwania')
        .setDescription('Wartość do wyszukania')
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, guildId } = interaction;
    const searchOption = options.getString('opcja_wyszukiwania');
    const searchValue = options.getString('wartosc_wyszukiwania');
    const emojis = findEmojis(guildId, searchOption, searchValue, interaction.client);

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
  },
};

// Set up the REST client
const rest = new REST({ version: '10' }).setToken('YOUR_BOT_TOKEN');

// Register slash commands
(async () => {
  try {
    console.log('Rozpoczynanie odświeżania komend...');

    // Replace 'YOUR_CLIENT_ID' with the actual client ID
    await rest.put(
      Routes.applicationCommands('YOUR_CLIENT_ID'),
      { body: [module.exports.data.toJSON()] },
    );

    console.log('Zaktualizowano komendy pomyślnie!');
  } catch (error) {
    console.error(error);
  }
})();
