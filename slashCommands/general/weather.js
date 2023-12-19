// const axios = require('axios');
// const { EmbedBuilder } = require('discord.js');
// const { SlashCommandBuilder } = require("discord.js");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("pogoda")
//     .setDescription("Sprawdź aktualną pogodę")
//   //   .addStringOption(option =>
//   //     option
//   //       .setName("miejsce")
//   //       .setDescription("Podaj miejsce (miasto, wieś lub kod pocztowy)")
//   //       .setRequired(true)
//   // )
//   ,
//   async execute(interaction) {
//     const { options } = interaction;
//     // const location = options.getString('miejsce');

//     try {
//       const weatherInfo = await getWeatherInfo();

//       console.log(weatherInfo);
//       const embed = new EmbedBuilder()
//         // .setTitle(`Aktualna pogoda w ${weatherInfo.location.city}`)
//         // .addField('Temperatura', `${weatherInfo.current_weather.temperature}°C`, true)//
//         // .addFields({nam}e:{
//         //   name value:: "Inline field title",
//         //   value: "Some value here",
//         //   inline: true,
//         // })
//         .addFields({ name: 'Temperatura', value: `${weatherInfo.current.temperature_2m}°C`, inline: true })//
//         // .addField('Wilgotność', `${weatherInfo.current_weather.humidity}%`, true)//
//         .addFields({ name: 'Wilgotność', value: `${weatherInfo.current.relative_humidity_2m}%`, inline: true })//
//         // .addField('Prędkość wiatru', `${weatherInfo.current_weather.windspeed} m/s`, true)//
//         .addFields({ name: 'Prędkość wiatru', value: `${weatherInfo.current.wind_speed_10m} m/s`, inline: true})//
//       // .addField('Zachmurzenie', `${weatherInfo.current_weather.weatherdescription}`, true)
//       // .addField('Ciśnienie atmosferyczne', `${weatherInfo.current_weather.pressure} hPa`, true)
//       .addFields({ name: 'Ciśnienie atmosferyczne', value: `${weatherInfo.current.pressure_msl} hPa`, inline: true})
//       // .addField('Widoczność', `${weatherInfo.current_weather.visibility} km`, true)
//       // .addField('UV Index', `${await getUVIndex(weatherInfo.location.lat, weatherInfo.location.lon)}`, true)
//       // .addField('Faza Księżyca', `${await getMoonPhase(weatherInfo.location.lat, weatherInfo.location.lon)}`, true)
//       // .addField('Informacje o Słońcu', generateSunInfo(await getSunInfo(weatherInfo.location.lat, weatherInfo.location.lon)))
//       // .addField('Jakość powietrza', `${weatherInfo.current_weather.airqualityindex}`, true)
//       // .addField('Opady śniegu', `${weatherInfo.current_weather.snowfall} cm`, true)
//       // .addField('Ilość opadów', `${weatherInfo.current_weather.precipitation} mm`, true)
//         .addFields({ name: 'Ilość opadów', value: `${weatherInfo.current.precipitation} mm`, inline: true})
//       // .addField('Wilgotność gleby', `${weatherInfo.current_weather.soilhumidity}%`, true)
//       // .addField('Poziom opadów', `${weatherInfo.current_weather.rainlevel}`, true)
//       // .addField('Wskazówki dotyczące ubioru', getDressAdvice(weatherInfo.current_weather.temperature))
//         .addFields({ name: 'Wskazówki dotyczące ubioru', value: getDressAdvice(weatherInfo.current.temperature_2m) })
//       // .addField('Promieniowanie UV', getUVAdvice(await getUVIndex(weatherInfo.location.lat, weatherInfo.location.lon)))
//       // .addField('Prognoza na najbliższe godziny', generateHourlyForecast(weatherInfo.forecast.hourly))
//       // .addField('Prognoza na kilka najbliższych dni', generateDailyForecast(weatherInfo.forecast.daily))
//       // .setColor(getTemperatureColor(weatherInfo.current_weather.temperature))
//       .setColor(getTemperatureColor(weatherInfo.current.temperature_2m))
//       // .setThumbnail(getWeatherIconURL(weatherInfo.current_weather.weathercode))
//       // .setThumbnail(getWeatherIconURL(weatherInfo.current.weathercode))
//       // .setFooter('Dane pogodowe dostarczone przez Open-Meteo')
//       .setTimestamp();

//     interaction.reply({ embeds: [embed] });
//   } catch (error) {
//     console.error('Błąd pobierania danych pogodowych:', error.message);

//     if (error.response && error.response.status === 404) {
//       interaction.reply({ content: `Nie znaleziono informacji pogodowej dla miejsca "${location}". Sprawdź poprawność wpisanego miejsca.`, ephemeral: true });
//     } else {
//       interaction.reply({ content: 'Wystąpił błąd podczas pobierania danych pogodowych.', ephemeral: true });
//     }
//   }
//   },
// };
//   // const command = new SlashCommandBuilder()
//   //   .setName('pogoda')
//   //   .setDescription('Sprawdź aktualną pogodę')
//   //   .addStringOption(option =>
//   //     option.setName('miejsce')
//   //       .setDescription('Podaj miejsce (miasto, wieś lub kod pocztowy)')
//   //       .setRequired(true)
//   //   )
//   //   .toJSON();

  

// function generateHourlyForecast(hourlyForecast) {
//   return hourlyForecast.map((hour) => {
//     const time = new Date(hour.timestamp * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
//     return `**${time}**: ${hour.temperature}°C, ${hour.weatherdescription}, Odczuwalna: ${hour.feelslike}°C, Opady: ${hour.precipitation}%, Zachmurzenie: ${hour.cloudcover}%`;
//   }).join('\n');
// }

// function generateDailyForecast(dailyForecast) {
//   return dailyForecast.map((day) => {
//     const date = new Date(day.timestamp * 1000).toLocaleDateString('pl-PL', { weekday: 'long', month: 'long', day: 'numeric' });
//     return `**${date}**: ${day.temperature}°C, ${day.weatherdescription}, Odczuwalna: ${day.feelslike}°C, Opady: ${day.precipitation}%, Zachmurzenie: ${day.cloudcover}%`;
//   }).join('\n');
// }

// function generateSunInfo(sunInfo) {
//   return `**Wschód Słońca:** ${sunInfo.sunrise}\n**Zachód Słońca:** ${sunInfo.sunset}\n**Wschód Księżyca:** ${sunInfo.moonrise}\n**Zachód Księżyca:** ${sunInfo.moonset}`;
// }

// function getTemperatureColor(temperature) {
//   if (temperature < 0) {
//     return '#0099ff'; // Zimno (niebieski)
//   } else if (temperature < 15) {
//     return '#00cc00'; // Chłodno (zielony)
//   } else if (temperature < 25) {
//     return '#ffcc00'; // Umiarkowanie (żółty)
//   } else {
//     return '#ff3300'; // Ciepło (czerwony)
//   }
// }

// function getWeatherIconURL(weatherCode) {
//   return `https://www.weatherbit.io/static/img/icons/${weatherCode}.png`;
// }

// async function getWeatherInfo() {
//   // const response = await axios.get(`https://api.open-meteo.com/weather?location=${encodeURIComponent(location)}`);
//   const response = await axios.get(
//     `https://api.open-meteo.com/v1/forecast?latitude=51.1&longitude=17.0333&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=1`
//   );
//   return response.data;
// }

// async function getUVIndex(lat, lon) {
//   const uvIndexUrl = `https://api.open-meteo.com/weather?latitude=${lat}&longitude=${lon}&daily=weather&hourly=uvindex`;
//   const uvIndexResponse = await axios.get(uvIndexUrl);
//   return uvIndexResponse.data.hourly[0].uvindex;
// }

// async function getMoonPhase(lat, lon) {
//   const moonPhaseUrl = `https://api.open-meteo.com/weather?latitude=${lat}&longitude=${lon}&daily=moonphase`;
//   const moonPhaseResponse = await axios.get(moonPhaseUrl);
//   return moonPhaseResponse.data.daily[0].moonphase.phase;
// }

// async function getSunInfo(lat, lon) {
//   const sunInfoUrl = `https://api.open-meteo.com/weather?latitude=${lat}&longitude=${lon}&daily=sun`;
//   const sunInfoResponse = await axios.get(sunInfoUrl);
//   const sunInfo = sunInfoResponse.data.daily[0];
//   return {
//     sunrise: new Date(sunInfo.sunrise * 1000).toLocaleTimeString('pl-PL'),
//     sunset: new Date(sunInfo.sunset * 1000).toLocaleTimeString('pl-PL'),
//     moonrise: new Date(sunInfo.moonrise * 1000).toLocaleTimeString('pl-PL'),
//     moonset: new Date(sunInfo.moonset * 1000).toLocaleTimeString('pl-PL'),
//   };
// }

// function getDressAdvice(temperature) {
//   if (temperature < 0) {
//     return 'Ubierz się bardzo ciepło, to jest mroźny dzień!';
//   } else if (temperature < 10) {
//     return 'Ubierz się ciepło, może być chłodno.';
//   } else if (temperature < 20) {
//     return 'Lekkie ubranie wystarczy, to jest przyjemna temperatura.';
//   } else {
//     return 'Ubierz się lekko, to jest gorący dzień!';
//   }
// }

// function getUVAdvice(uvIndex) {
//   if (uvIndex < 3) {
//     return 'Niskie ryzyko promieniowania UV. Nie ma potrzeby stosowania środków ochrony przeciwsłonecznej.';
//   } else if (uvIndex < 6) {
//     return 'Średnie ryzyko promieniowania UV. Stosuj krem przeciwsłoneczny o SPF 30+ i zakładaj okulary przeciwsłoneczne.';
//   } else if (uvIndex < 8) {
//     return 'Wysokie ryzyko promieniowania UV. Unikaj ekspozycji na słońce w okresie 10:00-16:00, stosuj krem przeciwsłoneczny o SPF 30+ i nos ochronę przeciwsłoneczną.';
//   } else if (uvIndex < 11) {
//     return 'Bardzo wysokie ryzyko promieniowania UV. Unikaj ekspozycji na słońce, nos ochronę przeciwsłoneczną, okulary przeciwsłoneczne i nakrycie głowy.';
//   } else {
//     return 'Ekstremalne ryzyko promieniowania UV. Unikaj ekspozycji na słońce, nos ochronę przeciwsłoneczną, okulary przeciwsłoneczne i nakrycie głowy. Zalecane pozostawanie w cieniu.';
//   }
// }


const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const {createSimpleEmbed} = require('../../computings/createEmbed');

// Definicja miast wraz z odpowiadającymi im współrzędnymi
const daneMiejsc = [
    {name: 'Nowy Jork', value: "40.7128 -74.0060"},
    {name: 'Tokio', value: "35.6895 139.6917"},
    {name: 'Londyn', value: "51.5074 -0.1278"},
    {name: 'Berlin', value: "52.5200 13.4050"},
    {name: 'Bodzanów', value: "52.3552 20.1279"},
    {name: 'Warszawa', coordinates: [52.2297, 21.0122]},
    {name: 'Kraków', coordinates: [50.0647, 19.9450]},
    {name: 'Łódź', coordinates: [51.7592, 19.4558]},
    {name: 'Wrocław', coordinates: [51.1079, 17.0385]},
    {name: 'Poznań', coordinates: [52.4064, 16.9252]},
    {name: 'Gdańsk', coordinates: [54.3520, 18.6466]},
    {name: 'Szczecin', coordinates: [53.4289, 14.5530]},
    {name: 'Bydgoszcz', coordinates: [53.1235, 18.0084]},
    {name: 'Lublin', coordinates: [51.2465, 22.5684]},
    {name: 'Katowice', coordinates: [50.2649, 19.0238]},
    {name: 'Białystok', coordinates: [53.1325, 23.1688]},
    {name: 'Gdynia', coordinates: [54.5189, 18.5305]},
    {name: 'Częstochowa', coordinates: [50.8171, 19.1183]},
    {name: 'Radom', coordinates: [51.4026, 21.1471]},
    {name: 'Sosnowiec', coordinates: [50.2749, 19.1056]},
    {name: 'Rzeszów', coordinates: [50.0412, 21.9991]},
    {name: 'Toruń', coordinates: [53.0138, 18.5984]},
    {name: 'Kielce', coordinates: [50.8703, 20.6275]},
    {name: 'Gliwice', coordinates: [50.2940, 18.6600]},
    {name: 'Zielona Góra', coordinates: [51.9356, 15.5064]},
    {name: 'Olsztyn', coordinates: [53.7799, 20.4942]},
    {name: 'Bielsko-Biała', coordinates: [49.8224, 19.0584]},
    {name: 'Bytom', coordinates: [50.3484, 18.9158]},
    {name: 'Zabrze', coordinates: [50.2979, 18.6131]},
    {name: 'Ruda Śląska', coordinates: [50.2578, 18.8566]},
    {name: 'Rybnik', coordinates: [50.0975, 18.5416]},
    {name: 'Tychy', coordinates: [50.1300, 18.9664]},
    {name: 'Dąbrowa Górnicza', coordinates: [50.3184, 19.2171]},
    {name: 'Opole', coordinates: [50.6753, 17.9213]},
    {name: 'Gorzów Wielkopolski', coordinates: [52.7368, 15.2288]},
    {name: 'Płock', coordinates: [52.5461, 19.7060]},
    {name: 'Elbląg', coordinates: [54.1525, 19.4084]},
    {name: 'Wałbrzych', coordinates: [50.7749, 16.2844]},
    {name: 'Włocławek', coordinates: [52.6644, 19.0671]},
    {name: 'Tarnów', coordinates: [50.0124, 20.9860]},
    {name: 'Chorzów', coordinates: [50.2975, 18.9540]},
    {name: 'Kalisz', coordinates: [51.7619, 18.0918]},
    {name: 'Koszalin', coordinates: [54.1944, 16.1722]},
    {name: 'Legnica', coordinates: [51.2100, 16.1610]},
    {name: 'Grudziądz', coordinates: [53.4822, 18.7544]},
    {name: 'Kędzierzyn-Koźle', coordinates: [50.3411, 18.2048]},
    {name: 'Słupsk', coordinates: [54.4642, 17.0287]},
    {name: 'Jaworzno', coordinates: [50.2038, 19.2750]},
    {name: 'Jastrzębie-Zdrój', coordinates: [49.9474, 18.6019]},
    {name: 'Nowy Sącz', coordinates: [49.6250, 20.7090]},
    {name: 'Lubin', coordinates: [51.3962, 16.1988]},
    {name: 'Konin', coordinates: [52.2371, 18.2511]},
    {name: 'Piła', coordinates: [53.1497, 16.7336]},
    {name: 'Ostrowiec Świętokrzyski', coordinates: [50.9466, 21.3849]},
    {name: 'Suwałki', coordinates: [54.1120, 22.9308]},
    {name: 'Gniezno', coordinates: [52.5324, 17.5988]},
    {name: 'Stargard', coordinates: [53.3419, 15.0423]},
    {name: 'Siemianowice Śląskie', coordinates: [50.3058, 19.0295]},
    {name: 'Piotrków Trybunalski', coordinates: [51.4022, 19.7025]},
    {name: 'Inowrocław', coordinates: [52.7942, 18.2567]},
    {name: 'Lędziny', coordinates: [50.1167, 19.1167]},
    {name: 'Legionowo', coordinates: [52.4012, 20.9716]},
    {name: 'Ostrów Wielkopolski', coordinates: [51.6461, 17.8141]},
    {name: 'Mysłowice', coordinates: [50.2334, 19.1367]},
    {name: 'Siemiatycze', coordinates: [52.4313, 22.8589]},
    {name: 'Przemyśl', coordinates: [49.7847, 22.7674]},
    {name: 'Jelenia Góra', coordinates: [50.9049, 15.7197]},
    {name: 'Nowy Targ', coordinates: [49.4782, 20.0309]},
    {name: 'Zamość', coordinates: [50.7185, 23.2531]},
    {name: 'Otwock', coordinates: [52.1052, 21.2604]},
    {name: 'Stalowa Wola', coordinates: [50.5630, 22.0470]},
    {name: 'Tomaszów Mazowiecki', coordinates: [51.5421, 20.0159]},
    {name: 'Świdnica', coordinates: [50.8500, 16.5000]},
    {name: 'Świętochłowice', coordinates: [50.2974, 18.9143]},
    {name: 'Starachowice', coordinates: [51.0373, 21.0515]},
    {name: 'Krotoszyn', coordinates: [51.6962, 17.4313]},
    {name: 'Sopot', coordinates: [54.4416, 18.5601]},
    {name: 'Krosno', coordinates: [49.6941, 21.7674]},
    {name: 'Bolesławiec', coordinates: [51.2639, 15.5582]},
    {name: 'Turek', coordinates: [52.0159, 18.4978]},
    {name: 'Żory', coordinates: [50.0495, 18.6940]},
    {name: 'Piekary Śląskie', coordinates: [50.3833, 18.9333]},
    {name: 'Śrem', coordinates: [52.0957, 17.0170]},
    // Dodaj inne miasta i wsie według potrzeb
];




const choices = Object.entries(daneMiejsc).map(([name, value]) => ({ name, value }));
const xd=[{ name: 'Funny', value: 'gif_funny' },
{ name: 'Meme', value: {x:'gif_meme'} },
{ name: 'Movie', value: {a:'gif_movie'} }]
module.exports = {
  data: new SlashCommandBuilder()
    .setName('pogoda')
    .setDescription('Sprawdź aktualną pogodę')
    .addStringOption((option) =>
      option
        .setName('miejsce')
        .setDescription('Wybierz miasto')
        .setRequired(true)
        // .addChoices(daneMiejsc)
    // .addChoices(...daneMiejsc)
      .addChoices(...daneMiejsc)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const indeksWybranejOpcji = options.getString('miejsce');
    
    // Pobierz wybrane miasto na podstawie indeksu
    const wybraneMiasto = daneMiejsc.filter(a=>a.value==indeksWybranejOpcji)[0].name
    const wspolrzedne = indeksWybranejOpcji.split(" ");
    // console.log(wspolrzedne, wybraneMiasto);
    const [ lat, lon ] = wspolrzedne;
    try {
      const informacjePogodowe = await pobierzInformacjePogodowe(lat, lon);
      // const indeksUV = await pobierzIndeksUV(wspolrzedne.lat, wspolrzedne.lon);

      // console.log(informacjePogodowe);
      // const wbudowany=createSimpleEmbed(`Aktualna pogoda w ${wybraneMiasto}`+Object.entries(informacjePogodowe.current).map(([klucz, wartość]) => ({ name: klucz, value: wartość })))
      const wbudowany=createWeatherEmbed(informacjePogodowe, wybraneMiasto)
      // const wbudowany = new EmbedBuilder()
      //   .setTitle(`Aktualna pogoda w ${wybraneMiasto}`)
      //   .addFields('Współrzędne', `Szerokość: ${lat}, Długość: ${lon}`)
      //   .addFields(
      //     Object.entries(informacjePogodowe.current).map(([klucz, wartość]) => ({ name: klucz, value: wartość }))
      //   )
      //   .addFields('Wskazówki dotyczące ubioru', getDressAdvice(informacjePogodowe.current.temperature_2m))
      //   // .addField('Promieniowanie UV', getUVAdvice(indeksUV))
      //   .setColor(getTemperatureColor(informacjePogodowe.current.temperature_2m))
      //   .setTimestamp();

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

async function pobierzInformacjePogodowe(lat, lon) {
  
  // console.log(lat,lon);
  const odpowiedź = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=1`
  );
  return odpowiedź.data;
}

// async function pobierzIndeksUV(szerokosc, dlugosc) {
//   const urlIndeksuUV = `https://api.open-meteo.com/weather?latitude=${szerokosc}&longitude=${dlugosc}&daily=weather&hourly=uvindex`;
//   const odpowiedźIndeksuUV = await axios.get(urlIndeksuUV);
//   return odpowiedźIndeksuUV.data.hourly[0].uvindex;
// }

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

function createWeatherEmbed(weatherInfo, wybraneMiasto) {
  const currentUnits = weatherInfo.current_units;
  const currentData = weatherInfo.current;

  const weatherFields = Object.entries(currentData).map(([key, value]) => {
    const unit = currentUnits[key] || ''; // Pobierz jednostkę, jeśli istnieje
    // return { name: key, value: `${value} ${unit}` };
    return { name: translateLabel(key), value: `${value} ${unit}`, inline: true  };
  });

  const embed = new EmbedBuilder()
    .setTitle(`Aktualna pogoda w ${wybraneMiasto}`)
    .addFields(
      ...weatherFields,
      { name: 'Wskazówki dotyczące ubioru', value: getDressAdvice(currentData.temperature_2m) },
      // { name: 'Promieniowanie UV', value: getUVAdvice(uvIndex) }
    )
    .setColor(getTemperatureColor(currentData.temperature_2m))
    .setTimestamp();

  return embed;
}

function translateLabel(label) {
  // Tutaj możesz dodać mapowanie etykiet na polskie odpowiedniki
  const translations = {
    time: 'Czas',
    interval: 'Interwał',
    temperature_2m: 'Temperatura',
    relative_humidity_2m: 'Wilgotność',
    apparent_temperature: 'Odczuwalna temperatura',
    is_day: 'Czy dzień',
    precipitation: 'Opady',
    rain: 'Deszcz',
    showers: 'Przelotne opady',
    snowfall: 'Opady śniegu',
    weather_code: 'Kod pogodowy',
    cloud_cover: 'Zachmurzenie',
    pressure_msl: 'Ciśnienie atmosferyczne',
    surface_pressure: 'Ciśnienie na powierzchni',
    wind_speed_10m: 'Prędkość wiatru',
    wind_direction_10m: 'Kierunek wiatru',
    wind_gusts_10m: 'Podmuchy wiatru',
  };

  return translations[label] || label;
}
