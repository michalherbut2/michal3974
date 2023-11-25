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
const content = `### muzyczne:
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