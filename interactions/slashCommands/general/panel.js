const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Odtwarzacz piosenek"),
    // .setDefaultPermission(false), // Ustawienie uprawnień komendy, możesz to dostosować według potrzeb

  async execute(interaction) {
    try {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("pause")
            .setLabel("Pauza")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⏸️"),
          
          new ButtonBuilder()
            .setCustomId("unpause")
            .setLabel("Odpałzuj")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("▶️"),

          new ButtonBuilder()
            .setCustomId("skip")
            .setLabel("Następna Piosenka")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⏭️"),

          new ButtonBuilder()
            .setCustomId("stop")
            .setLabel("Usuń Wszystko")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("⏹️")
        );

      await interaction.reply({
        content: "Odtwarzacz piosenek",
        components: [row],
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error executing panel command:", error);
      await interaction.reply({
        content: `Wystąpił błąd przy wykonywaniu polecenia: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};