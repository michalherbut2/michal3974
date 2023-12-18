const { SlashCommandBuilder } = require("discord.js");
const { createEmbed } = require("../../computings/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Pokazuje komendy!"),
  async execute(interaction) {
    await interaction.reply({ embeds: [createEmbed("Komendy", content)] });
  },
};
const content = `### muzyczne:
**/play** - podaj nazwę z yt lub link
**/skip** - skipuje aktualną pisoenkę lub o danym numerze
**pause** - pauzuje muzykę
**unpause** - wznawia muzykę
**queue** - wyświetla kolejkę piosenek
**stop** - kończy zabawę
**/panel** - daje panel
**/radio** - odpala radio
**/pętla** - gra ciągle tą samą piosenkę
****

### ogólne:
**/nb** - pokazuje nieobecnośći adminów

### ostrzeżenia:
**/poka_wszystkie_ostrzezenia** - pokazuje wszystkie ostrzeżenia
**/poka_ostrzezenia** - pokazuje ostrzeżenia danej osoby

### plusy:
**/poka_wszystkie_plusy** - pokazuje wszystkie plusy
**/poka_plusy** - pokazuje plusy danej osoby

### dla adminów:
**/ostrzezenie dodaj** - dodaje ostrzeżenie danej osoby
**/ostrzezenie usun** - usuwa ostrzeżenie danej osoby
**/ostrzezenie czysc** - usuwa wszystkie ostrzeżenia danej osoby
**/config** - konfiguruje działanie bota 
**/sprawdzaj_nieobecnosci** - sprawdza nieobecnośći
`;