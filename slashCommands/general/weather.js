const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

// Definicja miast wraz z odpowiadającymi im współrzędnymi
const daneMiejsc = {
  'Warszawa': { lat: 52.2297, lon: 21.0122 },
  'Nowy Jork': { lat: 40.7128, lon: -74.0060 },
  'Tokio': { lat: 35.6895, lon: 139.6917 },
  'Londyn': { lat: 51.5074, lon: -0.1278 },
  'Berlin': { lat: 52.5200, lon: 13.4050 },
  'Płock': { lat: 52.5461, lon: 19.7060 },
  'Kraków': { lat: 50.0647, lon: 19.9450 },
  'Wrocław': { lat: 51.1079, lon: 17.0385 },
  'Poznań': { lat: 52.4064, lon: 16.9252 },
  'Bodzanów': { lat: 52.3552, lon: 20.1279 },
  'Gdańsk': { lat: 54.3520, lon: 18.6466 },
  'Łódź': { lat: 51.7592, lon: 19.4558 },
  'Szczecin': { lat: 53.4289, lon: 14.5530 },
  'Bydgoszcz': { lat: 53.1235, lon: 18.0084 },
  'Lublin': { lat: 51.2465, lon: 22.5684 },
  'Katowice': { lat: 50.2649, lon: 19.0238 },
  'Białystok': { lat: 53.1325, lon: 23.1688 },
  'Gdynia': { lat: 54.5189, lon: 18.5305 },
  'Częstochowa': { lat: 50.8171, lon: 19.1183 },
  'Radom': { lat: 51.4026, lon: 21.1471 },
  'Sosnowiec': { lat: 50.2749, lon: 19.1056 },
  // Dodaj więcej miast, jeśli potrzebujesz
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pogoda')
    .setDescription('Sprawdź aktualną pogodę')
    .addStringOption((option) =>
      option
        .setName('miejsce')
        .setDescription('Wybierz miasto')
        .setRequired(true)
        .addChoices(Object.keys(daneMiejsc).map((miasto, indeks) => ({ name: miasto, value: indeks.toString() })))
    ),
  async execute(interaction) {
    const { options } = interaction;
    const indeksWybranejOpcji = options.getString('miejsce');
    
    // Pobierz wybrane miasto na podstawie indeksu
    const wybraneMiasto = Object.keys(daneMiejsc)[parseInt(indeksWybranejOpcji)];
    const wspolrzedne = daneMiejsc[wybraneMiasto];

    try {
      const informacjePogodowe = await pobierzInformacjePogodowe(wspolrzedne);
      const indeksUV = await pobierzIndeksUV(wspolrzedne.lat, wspolrzedne.lon);

      console.log(informacjePogodowe);
      const wbudowany = new MessageEmbed()
        .setTitle(`Aktualna pogoda w ${informacjePogodowe.location.city}`)
        .addField('Współrzędne', `Szerokość: ${wspolrzedne.lat}, Długość: ${wspolrzedne.lon}`)
        .addFields(
          Object.entries(informacjePogodowe.current).map(([klucz, wartość]) => ({ name: klucz, value: wartość }))
        )
        .addField('Wskazówki dotyczące ubioru', getDressAdvice(informacjePogodowe.current.temperature_2m))
        .addField('Promieniowanie UV', getUVAdvice(indeksUV))
        .setColor(getTemperatureColor(informacjePogodowe.current.temperature_2m))
        .setTimestamp();

      interaction.reply({ embeds: [wbudowany] });
    } catch (błąd) {
      console.error('Błąd pobierania danych pogodowych:', błąd.message);

      if (błąd.response && błąd.response.status === 404) {
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

async function pobierzInformacjePogodowe(wspolrzedne) {
  const { lat, lon } = wspolrzedne;
  const odpowiedź = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=1`
  );
  return odpowiedź.data;
}

async function pobierzIndeksUV(szerokosc, dlugosc) {
  const urlIndeksuUV = `https://api.open-meteo.com/weather?latitude=${szerokosc}&longitude=${dlugosc}&daily=weather&hourly=uvindex`;
  const odpowiedźIndeksuUV = await axios.get(urlIndeksuUV);
  return odpowiedźIndeksuUV.data.hourly[0].uvindex;
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

function getUVAdvice(indeksUV) {
  if (indeksUV < 3) {
    return 'Niskie ryzyko promieniowania UV. Nie ma potrzeby stosowania środków ochrony przeciwsłonecznej.';
  } else if (indeksUV < 6) {
    return 'Średnie ryzyko promieniowania UV. Stosuj krem przeciwsłoneczny o SPF 30+ i zakładaj okulary przeciwsłoneczne.';
  } else if (indeksUV < 8) {
    return 'Wysokie ryzyko promieniowania UV. Unikaj ekspozycji na słońce w okresie 10:00-16:00, stosuj krem przeciwsłoneczny o SPF 30+ i nos ochronę przeciwsłoneczną.';
  } else if (indeksUV < 11) {
    return 'Bardzo wysokie ryzyko promieniowania UV. Unikaj ekspozycji na słońce, nos ochronę przeciwsłoneczną, okulary przeciwsłoneczne i nakrycie głowy.';
  } else {
    return 'Ekstremalne ryzyko promieniowania UV. Unikaj ekspozycji na słońce, nos ochronę przeciwsłoneczną, okulary przeciwsłoneczne i nakrycie głowy. Zalecane pozostawanie w cieniu.';
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

