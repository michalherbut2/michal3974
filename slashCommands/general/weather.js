const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pogoda')
    .setDescription('Sprawdź aktualną pogodę')
    .addStringOption((option) =>
      option.setName('miejsce').setDescription('Podaj miejsce (miasto, wieś lub kod pocztowy)').setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const location = options.getString('miejsce');

    try {
      const coordinates = await getCoordinates(location);
      const weatherInfo = await getWeatherInfo(coordinates);
      const uvIndex = await getUVIndex(coordinates.latitude, coordinates.longitude);

      console.log(weatherInfo);
      const embed = new MessageEmbed()
        .setTitle(`Aktualna pogoda w ${weatherInfo.location.city}`)
        .addFields(
          { name: 'Temperatura', value: `${weatherInfo.current.temperature_2m}°C`, inline: true },
          { name: 'Wilgotność', value: `${weatherInfo.current.relative_humidity_2m}%`, inline: true },
          { name: 'Prędkość wiatru', value: `${weatherInfo.current.wind_speed_10m} m/s`, inline: true },
          { name: 'Ciśnienie atmosferyczne', value: `${weatherInfo.current.pressure_msl} hPa`, inline: true },
          { name: 'Ilość opadów', value: `${weatherInfo.current.precipitation} mm`, inline: true }
        )
        .addField('Wskazówki dotyczące ubioru', getDressAdvice(weatherInfo.current.temperature_2m))
        .addField('Promieniowanie UV', getUVAdvice(uvIndex))
        .setColor(getTemperatureColor(weatherInfo.current.temperature_2m))
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Błąd pobierania danych pogodowych:', error.message);

      if (error.response && error.response.status === 404) {
        interaction.reply({
          content: `Nie znaleziono informacji pogodowej dla miejsca "${location}". Sprawdź poprawność wpisanego miejsca.`,
          ephemeral: true,
        });
      } else {
        interaction.reply({ content: 'Wystąpił błąd podczas pobierania danych pogodowych.', ephemeral: true });
      }
    }
  },
};

async function getCoordinates(location) {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
    params: {
      q: location,
      format: 'json',
    },
  });

  const firstResult = response.data[0];
  if (!firstResult) {
    throw new Error('Nie znaleziono współrzędnych dla podanego miejsca');
  }

  const { lat, lon } = firstResult;
  return { latitude: lat, longitude: lon };
}

async function getWeatherInfo(coordinates) {
  const { latitude, longitude } = coordinates;
  const response = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=1`
  );
  return response.data;
}

async function getUVIndex(lat, lon) {
  const uvIndexUrl = `https://api.open-meteo.com/weather?latitude=${lat}&longitude=${lon}&daily=weather&hourly=uvindex`;
  const uvIndexResponse = await axios.get(uvIndexUrl);
  return uvIndexResponse.data.hourly[0].uvindex;
}

function getDressAdvice(temperature) {
  if (temperature < 0) {
    return 'Ubierz się bardzo ciepło, to jest mroźny dzień!';
  } else if (temperature < 10) {
    return 'Ubierz się ciepło, może być chłodno.';
  } else if (temperature < 20) {
    return 'Lekkie ubranie wystarczy, to jest przyjemna temperatura.';
  } else {
    return 'Ubierz się lekko, to jest gorący dzień!';
  }
}

function getUVAdvice(uvIndex) {
  if (uvIndex < 3) {
    return 'Niskie ryzyko promieniowania UV. Nie ma potrzeby stosowania środków ochrony przeciwsłonecznej.';
  } else if (uvIndex < 6) {
    return 'Średnie ryzyko promieniowania UV. Stosuj krem przeciwsłoneczny o SPF 30+ i zakładaj okulary przeciwsłoneczne.';
  } else if (uvIndex < 8) {
    return 'Wysokie ryzyko promieniowania UV. Unikaj ekspozycji na słońce w okresie 10:00-16:00, stosuj krem przeciwsłoneczny o SPF 30+ i nos ochronę przeciwsłoneczną.';
  } else if (uvIndex < 11) {
    return 'Bardzo wysokie ryzyko promieniowania UV. Unikaj ekspozycji na słońce, nos ochronę przeciwsłoneczną, okulary przeciwsłoneczne i nakrycie głowy.';
  } else {
    return 'Ekstremalne ryzyko promieniowania UV. Unikaj ekspozycji na słońce, nos ochronę przeciwsłoneczną, okulary przeciwsłoneczne i nakrycie głowy. Zalecane pozostawanie w cieniu.';
  }
}

function getTemperatureColor(temperature) {
  if (temperature < 0) {
    return '#0099ff'; // Zimno (niebieski)
  } else if (temperature < 15) {
    return '#00cc00'; // Chłodno (zielony)
  } else if (temperature < 25) {
    return '#ffcc00'; // Umiarkowanie (żółty)
  } else {
    return '#ff3300'; // Ciepło (czerwony)
  }
}
