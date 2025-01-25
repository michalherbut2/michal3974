const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("zrób głosowanie")
    .addStringOption(option =>
      option.setName("opis").setDescription("co głosujemy").setRequired(true)
    )
    .addStringOption(option => 
      option.setName("za").setDescription("tekst za").setRequired(false)
    )
    .addStringOption(option =>
      option.setName("przeciw").setDescription("tekst przeciw").setRequired(false)
    )
    .addStringOption(option => 
      option.setName("czas").setDescription("jak długo np. 1s, 2m, 3h, 4d").setRequired(false)
    ),

  async execute(interaction) {
    try {
      const startTime = Date.now();
      const description = interaction.options.getString("opis");
      const pro = interaction.options.getString("za") || "za";
      const opp = interaction.options.getString("przeciw") || "przeciw";
      const time = parseTimeToSeconds(interaction.options.getString("czas") || '1m');
      const endTime = parseInt(startTime / 1000) + time;

      // Create buttons for proponents and opponents
      const proponentButton = new ButtonBuilder()
        .setCustomId("proponent")
        .setLabel(pro)
        .setEmoji('😎')
        .setStyle(ButtonStyle.Success);
      
      const opponentButton = new ButtonBuilder()
        .setCustomId("opponent")
        .setLabel(opp)
        .setEmoji('🔥')
        .setStyle(ButtonStyle.Danger);

      // Create a row with the buttons
      const row = new ActionRowBuilder().addComponents(
        proponentButton,
        opponentButton
      );

      // Variables to store vote counts
      let proponents = { name: pro, value: "0", inline: true };
      let opponents = { name: opp, value: "0", inline: true };

      // Map to store user votes
      const userVotes = new Map();

      // Send the initial message with buttons and embed
      const votingEmbed = new EmbedBuilder()
        .setColor("#3498db")
        .setTitle(`Plebiscyt kończy się <t:${endTime}:R>`)
        .setDescription(description)
        .addFields(proponents, opponents);

      const message = await interaction.reply({
        embeds: [votingEmbed],
        components: [row],
      });

      // Create a collector for button clicks
      const collector = message.createMessageComponentCollector({
        time: time * 1000,
      });

      // Listen for button clicks
      collector.on("collect", async i => {
        await i.deferUpdate();
        const userId = i.user.id;

        // Check if the user has voted before
        if (userVotes.has(userId)) {
          // If the user has voted, toggle their vote
          if (i.customId === 'proponent' && userVotes.get(userId) === 'opponent') {
            proponents.value = (++proponents.value).toString();
            opponents.value = (--opponents.value).toString();
            userVotes.set(userId, 'proponent');
          } else if (i.customId === 'opponent' && userVotes.get(userId) === 'proponent') {
            proponents.value = (--proponents.value).toString();
            opponents.value = (++opponents.value).toString();
            userVotes.set(userId, 'opponent');
          }
        } else {
          // If the user has not voted, record their vote
          if (i.customId === 'proponent') {
            proponents.value = (++proponents.value).toString();
            userVotes.set(userId, 'proponent');
          } else if (i.customId === 'opponent') {
            opponents.value = (++opponents.value).toString();
            userVotes.set(userId, 'opponent');
          }
        }

        // Update the embed with real-time vote counts
        const updatedEmbed = new EmbedBuilder()
          .setColor("#3498db")
          .setTitle(`Plebiscyt kończy się <t:${endTime}:R>`)
          .setDescription(description)
          .addFields(proponents, opponents);

        // Edit the original message with updated embed
        await message.edit({
          embeds: [updatedEmbed],
          components: [row],
        });
      });

      // Listen for the end of the voting session
      collector.on("end", () => {
        // Display the final results
        const finalEmbed = new EmbedBuilder()
          .setColor("#3498db")
          .setTitle(`Plebiscyt zakończony!`)
          .setDescription(description)
          .addFields(proponents, opponents);

        message.edit({
          embeds: [finalEmbed],
          components: [],
        });
      });
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'vote':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas tworzenia głosowania!",
        ephemeral: true,
      });
    }
  },
};

function parseTimeToSeconds(timeString) {
  const regex = /^(\d+)([smhd])$/;
  const match = timeString.match(regex);
  if (!match) return 60; // Default to 60 seconds if invalid format
  const [, amount, unit] = match;
  const multiplier = { s: 1, m: 60, h: 3600, d: 86400 };
  return parseInt(amount) * multiplier[unit];
}