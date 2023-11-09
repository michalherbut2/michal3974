module.exports = {
  config: {
    name: "help",
    description: "shows all commands",
    usage: `help`,
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    message.channel.send(`## Komendy
### muzyczne:
**play** - podaj nazwę z yt lub link
**skip** - skipuje aktualną pisoenkę lub o danym numerze
**pause** - pauzuje muzykę
**unpause** - wznawia muzykę
**queue** - wyświetla kolejkę piosenek
**stop** - kończy zabawę
**panel** - daje panel
### ogólne:
**nb** - pokazuje nieobecnośći adminów
**pokaplusy** - pokazuje twoj plusy
**topplusy** - pokazuje top 10 plusów`);
  },
};
