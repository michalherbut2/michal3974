const { SlashCommandBuilder } = require("discord.js");
const { createEmbed } = require("../../computings/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Tworzy głosowanie!")
    .addStringOption(option =>
      option
        .setName('opis')
        .setDescription('Opis tego, na co chcesz przeprowadzić głosowanie')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Pobierz opis głosowania z opcji komendy
    const opisGlosowania = interaction.options.getString('opis');

    // Utwórz osadzenie (embed) dla wiadomości z głosowaniem
    const osadzenieGlosowania = createEmbed({
      title: "📊 Głosowanie",
      description: opisGlosowania,
      color: 0x3498db, // Możesz dostosować kolor według swoich preferencji
    });

    try {
      // Wyślij wiadomość z głosowaniem wraz z osadzeniem
      const wiadomosc = await interaction.reply({ embeds: [osadzenieGlosowania], fetchReply: true });

      // Zareaguj na wiadomość z głosowaniem emotikonami kciuka w górę i kciuka w dół
      await wiadomosc.react('1011298488149098546'); // Zakładając, że to jest niestandardowa emotikona
      await wiadomosc.react('👎');
    } catch (error) {
      console.error("Błąd podczas wysyłania głosowania:", error);
    }
  },
};
