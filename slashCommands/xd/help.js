const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Pokazuje komendy!"),
  async execute(interaction) {
    await interaction.reply(`## Komendy
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
