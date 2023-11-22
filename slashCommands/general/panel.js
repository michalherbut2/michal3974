const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Odtwarzacz piosenek"),
    // .setDefaultPermission(false), // Ustawienie uprawnień komendy, możesz to dostosować według potrzeb

  async execute(interaction) {
    const row = [
      {
        type: 1, // Typ 1 oznacza przycisk
        components: [
          {
            type: 2,
            style: 1,
            label: "Pauza",
            custom_id: "pause",
            emoji: "⏸️", // Dodaj emoji do przycisku
          },
          {
            type: 2, // Typ 2 oznacza przycisk interakcji
            style: 1, // Styl 1 to PRIMARY
            label: "Odpałzuj",
            custom_id: "unpause",
            emoji: "▶️",
          },

          {
            type: 2,
            style: 1,
            label: "Następna Piosenka",
            custom_id: "skip",
            emoji: "⏭️",
          },
          {
            type: 2,
            style: 1,
            label: "Usuń Wszystko",
            custom_id: "stop",
            emoji: "⏹️",
          },
        ],
      },
    ];

    await interaction.reply({
      content: "Odtwarzacz piosenek",
      components: row,
      ephemeral: true
    });
  },
};
