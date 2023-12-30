const { Lyrics } = require("@discord-player/extractor");
const lyricsClient = Lyrics.init();

module.exports = {
  name: "tekst",
  description: "Pobierz tekst piosenki.",
  usage: "[nazwaPiosenki]",
  category: "muzyka",
  options: [{
    type: "STRING",
    name: "zapytanie",
    description: "Tytuł piosenki do wyszukania tekstu",
    required: false
  }],
  async execute(bot, interaction) {
    await interaction.deferReply({ ephemeral: true });

    const queue = bot.player.getQueue(interaction.guild.id);

    const zapytanie = interaction.options.getString("zapytanie", false) ?? queue?.current?.title;

    if (!zapytanie)
      return bot.say.errorMessage(interaction, "Zapomniałeś podać tytułu piosenki.");

    const zapytanieSformatowane = zapytanie
      .toLowerCase()
      .replace(/\(tekst|teksty|oficjalne video muzyczne|oficjalne video hd|oficjalne video|audio|oficjalne|klip oficjalny|klip|rozszerzone|hq\)/g, "");

    const wynik = await lyricsClient.search(`${zapytanieSformatowane}`);

    if (!wynik || !wynik.lyrics)
      return bot.say.errorMessage(interaction, "Nie znaleziono tekstu do tej piosenki.");

    const embed = bot.say.baseEmbed(interaction)
      .setTitle(`${zapytanie}`)
      .setDescription(`${wynik.lyrics.slice(0, 4090)}...`);

    return interaction.editReply({ embeds: [embed] }).catch(console.error);
  }
};
