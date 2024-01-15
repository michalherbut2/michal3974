const { SlashCommandBuilder } = require('@discordjs/builders');
const { Lyrics } = require("@discord-player/extractor");
const lyricsClient = Lyrics.init();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tekst')
    .setDescription('Pobierz tekst piosenki.')
    .addStringOption(option => 
      option.setName('zapytanie')
        .setDescription('Tytuł piosenki do wyszukania tekstu')
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const bot = interaction.client;
    const queue = bot.player.getQueue(interaction.guild.id);

    const zapytanie = interaction.options.getString('zapytanie') ?? queue?.current?.title;

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
