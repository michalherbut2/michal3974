const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

// Definicja miast wraz z odpowiadającymi im współrzędnymi
const daneMiejsc = [
  { name: 'Warszawa', value: "52.2297 21.0122" },
  { name: 'Nowy Jork', value: "40.7128 -74.0060" },
  { name: 'Tokio', value: "35.6895 139.6917" },
  { name: 'Londyn', value: "51.5074 -0.1278" },
  { name: 'Berlin', value: "52.5200 13.4050" },
  { name: 'Płock', value: "52.5461 19.7060" },
  { name: 'Kraków', value: "50.0647 19.9450" },
  { name: 'Wrocław', value: "51.1079 17.0385" },
  { name: 'Poznań', value: "52.4064 16.9252" },
  { name: 'Bodzanów', value: "52.3552 20.1279" },
  { name: 'Gdańsk', value: "54.3520 18.6466" },
  { name: 'Łódź', value: "51.7592 19.4558" },
  { name: 'Szczecin', value: "53.4289 14.5530" },
  { name: 'Bydgoszcz', value: "53.1235 18.0084" },
  { name: 'Lublin', value: "51.2465 22.5684" },
  { name: 'Katowice', value: "50.2649 19.0238" },
  { name: 'Białystok', value: "53.1325 23.1688" },
  { name: 'Gdynia', value: "54.5189 18.5305" },
  { name: 'Częstochowa', value: "50.8171 19.1183" },
  { name: 'Radom', value: "51.4026 21.1471" },
  { name: 'Sosnowiec', value: "50.2749 19.1056" },
  // Dodaj więcej miast, jeśli potrzebujesz
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pogoda')
    .setDescription('Sprawdź aktualną pogodę')
    .addStringOption(option =>
      option
        .setName('miejsce')
        .setDescription('Wybierz miasto')
        .setRequired(true)
        .addChoices(...daneMiejsc.map(city => ({ name: city.name, value: city.value })))
    ),
  async execute(interaction) {
    const { options } = interaction;
    const indeksWybranejOpcji = options.getString('miejsce');

    // Pobierz wybrane miasto na podstawie indeksu
    const wybraneMiasto = daneMiejsc.find(city => city.value === indeksWybranejOpcji).name;
    const [lat, lon] = indeksWybranejOpcji.split(" ");

    try {
      const informacjePogodowe = await pobierzInformacjePogodowe(lat, lon);
      const wbudowany = createWeatherEmbed(informacjePogodowe, wybraneMiasto);

      interaction.reply({ embeds: [wbudowany] });
    } catch (error) {
      console.error('Błąd pobierania danych pogodowych:', error.message);

      if (error.response && error.response.status === 404) {
        interaction.reply({
          content: `Nie znaleziono informacji pogodowej dla miejsca "${wybraneMiasto}". Sprawdź poprawność wpisanego miejsca.`,
          ephemeral: true,
        });
      } else {
        interaction.reply({ content: 'Wystąpił błąd podczas pobierania danych pogodowych.', ephemeral: true });
      }
    }
  },
};

async function pobierzInformacjePogodowe(lat, lon) {
  const odpowiedź = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
  );
  return odpowiedź.data;
}

function getDressAdvice(temperatura) {
  if (temperatura < 0) {
    return 'Ubierz się bardzo ciepło, to jest mroźny dzień!';
  } else if (temperatura < 10) {
    return 'Ubierz się ciepło, może być chłodno.';
  } else if (temperatura < 20) {
    return 'Lekkie ubranie wystarczy, to jest przyjemna temperatura.';
  } else {
    return 'Ubierz się lekko, to jest gorący dzień!';
  }
}

function getTemperatureColor(temperatura) {
  if (temperatura < 0) {
    return '#0099ff'; // Zimno (niebieski)
  } else if (temperatura < 15) {
    return '#00cc00'; // Chłodno (zielony)
  } else if (temperatura < 25) {
    return '#ffcc00'; // Umiarkowanie (żółty)
  } else {
    return '#ff3300'; // Ciepło (czerwony)
  }
}

function createWeatherEmbed(weatherInfo, wybraneMiasto) {
  const currentWeather = weatherInfo.current_weather;

  const embed = new EmbedBuilder()
    .setTitle(`Aktualna pogoda w ${wybraneMiasto}`)
    .addFields(
      { name: 'Temperatura', value: `${currentWeather.temperature}°C`, inline: true },
      { name: 'Wilgotność', value: `${currentWeather.relative_humidity}%`, inline: true },
      { name: 'Prędkość wiatru', value: `${currentWeather.wind_speed} m/s`, inline: true },
      { name: 'Ciśnienie atmosferyczne', value: `${currentWeather.pressure_msl} hPa`, inline: true },
      { name: 'Ilość opadów', value: `${currentWeather.precipitation} mm`, inline: true },
      { name: 'Wskazówki dotyczące ubioru', value: getDressAdvice(currentWeather.temperature) }
    )
    .setColor(getTemperatureColor(currentWeather.temperature))
    .setTimestamp();

  return embed;
}