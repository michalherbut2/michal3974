const { createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");
const http = require('http');

module.exports = async (song) => {
  try {
    // Sprawdź, czy użytkownik podał zapytanie
    if (!song) {
      throw new Error("Nie podano zapytania.");
    }

    // Przeszukaj utwory
    const yt_info = await play.search(song, { limit: 1 });

    if (!yt_info || yt_info.length === 0) {
      throw new Error("Brak wyników dla podanego zapytania.");
    }

    const { url, title, durationRaw } = yt_info[0];

    console.log(`Pobieranie ${title}...`);

    // Opcje strumienia
    const streamOptions = {
      discordPlayerCompatibility: true,
      highWaterMark: 1 << 25, // Ustaw wysoką wartość highWaterMark w przypadku problemów z buforem
    };

    // Odtwarzaj audio z opcjami strumienia
    const { stream } = await play.stream(url, streamOptions);

    // Sprawdź, czy strumień jest dostępny
    if (!stream) {
      throw new Error("Nie można uzyskać dostępu do strumienia.");
    }

    // Sprawdź, czy strumień zawiera dane
    stream.once('readable', () => {
      if (!stream.read()) {
        throw new Error("Strumień nie zawiera danych.");
      }
    });

    // Stwórz AudioResource
    const zasób = createAudioResource(stream);

    // Ustaw metadane
    zasób.metadata = {
      title,
      duration: durationRaw,
      stream,
    };

    console.log(`Pobieranie zakończone dla ${title}`);
    return zasób;
  } catch (error) {
    console.error("Błąd w playHandler:", error.message, error.stack);

    // Dodaj dodatkowe obszary obsługi błędów
    if (error instanceof play.SearchError) {
      console.error("Błąd wyszukiwania:", error.reason);
    } else if (error instanceof play.StreamError) {
      console.error("Błąd strumienia:", error.reason);

      if (error.code === "ECONNRESET") {
        console.log("Próba ponownego nawiązania połączenia...");
        const reconnectedStream = await reconnectStream(url, streamOptions, 3); // Proba ponownego polaczenia przez 3 sekundy
        if (reconnectedStream) {
          console.log("Ponowne nawiązanie połączenia powiodło się.");
          return createAudioResource(reconnectedStream);
        } else {
          console.error("Nie udało się ponownie nawiązać połączenia.");
        }
      }
    } else if (error.code === "ENOTFOUND") {
      console.error("Błąd połączenia: Nie znaleziono hosta.");
      const foundHost = await findHost(url, 60); // Szukaj hosta przez 60 sekund
      if (foundHost) {
        console.log("Znaleziono hosta. Kontynuowanie...");
        return null; // Przerwij dalszą obsługę lub zwróć inny wynik w zależności od potrzeb
      } else {
        console.error("Nie udało się znaleźć hosta.");
      }
    } else if (error.code === "ECONNRESET") {
      console.error("Błąd połączenia: Połączenie zostało zresetowane.");
      const reconnectedStream = await reconnectStream(url, streamOptions, 3); // Proba ponownego polaczenia przez 3 sekundy
      if (reconnectedStream) {
        console.log("Ponowne nawiązanie połączenia powiodło się.");
        return createAudioResource(reconnectedStream);
      } else {
        console.error("Nie udało się ponownie nawiązać połączenia.");
      }
    } else if (error.code === "EAI_AGAIN") {
      console.error("Błąd połączenia: Brak dostępu do DNS.");
    } else {
      console.error("Nieobsługiwany błąd:", error.message);
    }

    return null;
  }
};

// Funkcja do ponownego nawiązania połączenia
async function reconnectStream(url, options, retryDuration) {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const { stream } = await play.stream(url, options);
      if (stream) {
        return stream;
      }
    } catch (retryError) {
      console.error("Błąd podczas ponownego nawiązywania połączenia:", retryError.message);
    }
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return null;
}

// Funkcja do szukania hosta
async function findHost(url, searchDuration) {
  let attempts = 0;
  while (attempts < 3) {
    try {
      // Pobierz host z adresu URL
      const { host } = new URL(url);

      // Spróbuj wykonać proste zapytanie HTTP do hosta
      await new Promise((resolve, reject) => {
        const req = http.get({ host, timeout: 1000 }, (res) => {
          // Sprawdź, czy odpowiedź jest poprawna
          if (res.statusCode === 200) {
            console.log("Znaleziono hosta.");
            resolve();
          } else {
            reject(new Error("Nieprawidłowy kod odpowiedzi HTTP."));
          }
        });

        // Obsługa błędów połączenia
        req.on('error', (err) => {
          reject(err);
        });

        // Zakończ zapytanie
        req.end();
      });

      return true;
    } catch (searchError) {
      console.error("Błąd podczas szukania hosta:", searchError.message);
    }
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}
