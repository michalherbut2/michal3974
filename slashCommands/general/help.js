const { SlashCommandBuilder } = require("discord.js");
const { createEmbed } = require("../../computings/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Pokazuje komendy!"),
  async execute(interaction) {
    // console.log(interaction.channel);
    // interaction.channel.send({ embeds: [createEmbed()] }); // const channel = interaction.channelchannel.send;
    // interaction.channel.send({
    //   embeds: [
    //     // {
    //     // title: 'Embed Title',
    //     // description: 'Embed Description',
    //     // color: 0x3498db, // You can use a color code or integer value
    //     // fields: [
    //     //   { name: 'Field 1', value: 'Value 1', inline: true },
    //     //   { name: 'Field 2', value: 'Value 2', inline: true },
    //     //   { name: 'Field 3', value: 'Value 3', inline: false },
    //     //   { name: 'Field 4', value: 'Value 4', inline: false },
    //     // ],
    //     // footer: { text: 'Embed Footer' },
    //     // }
    //     createEmbed("Komendy", [
    //       { name: "# play", value: "podaj **nazwę** z yt lub link"  },
    //       { name: "*play*", value: "podaj **nazwę** z yt lub link"  },
    //       { name: "__play__", value: "podaj **nazwę** z yt lub link"  },
    //       { name: "__play__", value: "podaj **nazwę** z yt lub link"  },
    //       { name: "__play__", value: "podaj **nazwę** z yt lub link"  },
    //       { name: "__play__", value: "podaj **nazwę** z yt lub link"  },
    //     ]),
    //   ],
    // }); // const channel = interaction.channelchannel.send;
    await interaction.reply({ embeds: [createEmbed("Komendy", content)] });
  },
};
const content = `### Komendy Muzyczne:
**/play** - podaj nazwę z yt lub link
**/skip** - skipuje aktualną piosenkę lub o danym numerze
**pause** - pauzuje muzykę
**unpause** - wznawia muzykę
**queue** - wyświetla kolejkę piosenek
**stop** - kończy zabawę
**/panel** - daje panel
**/radio** - odpala radio
**/pętla** - gra ciągle tą samą piosenkę

### Komendy Ogólne:
**/nb** - pokazuje nieobecności adminów

### Komendy Ostrzeżeń:
**/poka_wszystkie_ostrzezenia** - pokazuje wszystkie ostrzeżenia
**/poka_ostrzezenia** - pokazuje ostrzeżenia danej osoby

### Komendy Plusów:
**/poka_wszystkie_plusy** - pokazuje wszystkie plusy
**/poka_plusy** - pokazuje plusy danej osoby

### Komendy Dla Adminów:
**/ostrzezenie dodaj** - dodaje ostrzeżenie danej osoby
**/ostrzezenie usun** - usuwa ostrzeżenie danej osoby
**/ostrzezenie czysc** - usuwa wszystkie ostrzeżenia danej osoby
**/config** - konfiguruje działanie bota 
**/sprawdzaj_nieobecnosci** - sprawdza nieobecności

### Komendy Moderacyjne:
**/ban** - banuje użytkownika z serwera
**/kick** - wyrzuca użytkownika z serwera
**/mute** - wycisza użytkownika na serwerze
**/unmute** - odblokowuje użytkownika z wyciszenia na serwerze
**/set_role** - nadaje użytkownikowi rolę na serwerze
**/remove_role** - usuwa użytkownikowi rolę na serwerze
**/change_nick** - zmienia nick użytkownika na serwerze

### Komendy Rozrywkowe:
**/roll** - losuje liczbę z zakresu od 1 do 100
**/dice** - losuje liczbę z zakresu od 1 do 6
**/time** - wyświetla aktualną godzinę i datę
`;
