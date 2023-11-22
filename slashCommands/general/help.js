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
**/panel** - daje panel
**/radio** - odpala radio
### ogólne:
**/nb** - pokazuje nieobecnośći adminów
**/poka_plusy** - pokazuje twoje plusy
**/poka_wszystkie_plusy** - pokazuje wszystkie plusy
### ostrzeżenia:
**/poka_wszystkie_ostrzezenia** - pokazuje wszystkie ostrzeżenia
**/poka_ostrzezenia** - pokazuje ostrzeżenia danej osoby
**/ostrzezenie dodaj** - dodaje ostrzeżenie danej osoby [tylko dla adminów]
**/ostrzezenie usun** - usuwa ostrzeżenie danej osoby [tylko dla adminów]
**/ostrzezenie czysc** - usuwa wszystkie ostrzeżenia danej osoby [tylko dla adminów]
**/config** - konfiguruje działanie bota  [tylko dla adminów]
**/sprawdzaj_nieobecności** - sprawdza nieobecnośći [tylko dla adminów]
`);
  },
};
