const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Zrób głosowanie")
    .addStringOption((option) =>
      option.setName("opis").setDescription("Co głosujemy")
    )
    .addStringOption((option) =>
      option.setName("za").setDescription("Tekst za")
    )
    .addStringOption((option) =>
      option.setName("przeciw").setDescription("Tekst przeciw")
    )
    .addStringOption((option) =>
      option.setName("czas").setDescription("Jak długo np. 1s, 2m, 3h, 4d")
    ),

  async execute(interaction) {
    const startTime = Date.now();
    const endTime =
      startTime +
      parseTimeToSeconds(interaction.options.getString("czas") || "1m") * 1000;

    const description = interaction.options.getString("opis");
    const pro = interaction.options.getString("za") || "za";
    const opp = interaction.options.getString("przeciw") || "przeciw";
    const time =
      parseTimeToSeconds(interaction.options.getString("czas") || "1m");

    const proEmoji = "👍"; // Emotka lajka w górę
    const oppEmoji = "👎"; // Emotka drogi w dół

    // Wyślij początkową wiadomość z embedem
    const votingEmbed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle(`Plebiscyt kończy się <t:${Math.floor(endTime / 1000)}:R>`)
      .setDescription(description)
      .setFooter("Głosowanie trwa");

    const message = await interaction.reply({
      content: "Oddaj swój głos!",
      embeds: [votingEmbed],
    });

    // Dodaj emotki pod wiadomością
    await message.react(proEmoji);
    await message.react(oppEmoji);

    // Utwórz kolektor reakcji
    const filter = (reaction, user) => {
      return [proEmoji, oppEmoji].includes(reaction.emoji.name) && !user.bot;
    };

    const collector = message.createReactionCollector({
      filter,
      time: time * 1000,
    });

    // Nasłuchuj zdarzeń kolektora
    collector.on("collect", (reaction, user) => {
      const userId = user.id;

      if (reaction.emoji.name === proEmoji) {
        // Obsłuż głos "lajk w górę"
        proponents.value = (++proponents.value).toString();
        userVotes.set(userId, 'proponent');
      } else if (reaction.emoji.name === oppEmoji) {
        // Obsłuż głos "dróżka w dół"
        opponents.value = (++opponents.value).toString();
        userVotes.set(userId, 'opponent');
      }

      // Zaktualizuj wiadomość z wynikami
      const updatedEmbed = new EmbedBuilder()
        .setColor("#3498db")
        .setTitle(`Plebiscyt kończy się <t:${Math.floor(endTime / 1000)}:R>`)
        .setDescription(description)
        .addFields(proponents, opponents)
        .setFooter("Głosowanie trwa");

      message.edit({
        content: "Oddaj swój głos!",
        embeds: [updatedEmbed],
      });
    });

    // Zakończ kolektor po upływie czasu
    collector.on("end", (collected) => {
      // Wyślij ostateczne wyniki głosowania
      const resultEmbed = new EmbedBuilder()
        .setColor("#3498db")
        .setTitle("Plebiscyt zakończony!")
        .setDescription(description)
        .addFields(proponents, opponents);

      if (proponents.value > opponents.value) {
        resultEmbed.addField("Wynik", `${pro} zwycięża! 🎉`, true);
      } else if (proponents.value < opponents.value) {
        resultEmbed.addField("Wynik", `${opp} zwycięża! 🎉`, true);
      } else {
        resultEmbed.addField("Wynik", "Remis! 🤝", true);
      }

      message.edit({
        content: "Głosowanie zakończone!",
        embeds: [resultEmbed],
        components: [],
      });
    });
  },
};

function parseTimeToSeconds(timeString) {
  const regex = /^(\d+)([smhd])$/;
  const match = timeString.match(regex);
  if (!match) return 60; // Domyślnie 60 sekund w przypadku nieprawidłowego formatu
  const [, amount, unit] = match;
  const multiplier = { s: 1, m: 60, h: 3600, d: 86400 };
  return parseInt(amount) * multiplier[unit];
}
