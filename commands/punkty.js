module.exports = {
  config: {
    name: "gra",
    description: "Returns players list",
    usage: `gra`,
  },
  run: (client) => {
    const fs = require("fs");

    // Utwórz pusty obiekt, aby przechowywać plusy użytkowników.
    let plusy = {};

    // Odczytaj zapisane plusy z pliku JSON (jeśli istnieją)
    try {
      const data = fs.readFileSync("plusy.json");
      plusy = JSON.parse(data);
    } catch (error) {
      console.log("Brak zapisanych plusów. Tworzenie nowego pliku.");
      plusy = {};
    }

    client.on("messageCreate", message => {
      if (message.author.bot) return; // Ignoruj wiadomości od innych botów

      // Rozdziel wiadomość na argumenty
      const args = message.content.split(" ");

      // Sprawdź, czy komenda to "=dodaj plus" i czy użytkownik ma uprawnienia do jej użycia
      if (
        args[0] === "=dodaj" &&
        args[1] === "plus" &&
        message.member.permissions.has("ADMINISTRATOR")
      ) {
        const liczbaPlusow = parseInt(args[2]);
        const mentionedUser = message.mentions.users.first();

        if (!isNaN(liczbaPlusow) && mentionedUser) {
          const userID = mentionedUser.id;

          // Jeśli użytkownik jest już w słowniku, dodaj plusy do jego konta, w przeciwnym razie stwórz nowy wpis
          if (plusy[userID]) {
            plusy[userID] += liczbaPlusow;
          } else {
            plusy[userID] = liczbaPlusow;
          }

          message.channel.send(
            `${liczbaPlusow} plus(y) zostały dodane dla użytkownika ${mentionedUser.tag}.`
          );

          // Zapisz plusy do pliku JSON
          fs.writeFileSync("plusy.json", JSON.stringify(plusy, null, 2));
        }
      }

      // Sprawdź, czy komenda to "=plus liczba" i czy użytkownik jest w słowniku
      if (args[0] === "=plus") {
        const liczbaPlusow = parseInt(args[1]);
        const userID = message.author.id;

        if (!isNaN(liczbaPlusow) && plusy[userID]) {
          plusy[userID] += liczbaPlusow;
          message.channel.send(
            `Dodano ${liczbaPlusow} plus(y) do twojego konta. Aktualny stan plusów: ${plusy[userID]}`
          );

          // Zapisz plusy do pliku JSON
          fs.writeFileSync("plusy.json", JSON.stringify(plusy, null, 2));
        }
      }
    });
  }
};
