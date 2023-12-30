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
      option.setName("opis").setDescription("co głosujemy")
    )
    .addStringOption(option => option.setName("za").setDescription("tekst za"))
    .addStringOption(option =>
      option.setName("przeciw").setDescription("tekst przeciw")
  )
  .addStringOption(option =>
    option.setName("czas").setDescription("jak długo np. 1s, 2m, 3h, 4d")
  ),

  async execute(interaction) {
    const startTime=Date.now()
    const description = interaction.options.getString("opis");
    const pro = interaction.options.getString("za") || "za";
    const opp = interaction.options.getString("przeciw") || "przeciw";
    const time = parseTimeToSeconds(interaction.options.getString("czas") || '1m');
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

    // Set to store user IDs who have voted
    // const votedUsers = new Set();
    const userVotes = new Map();

    // Send the initial message with buttons and embed
    const votingEmbed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle(`Plebiscyt kończy się <t:${parseInt(startTime / 1000) + time}:R>`)
      .setDescription(description)
      .addFields(proponents, opponents);

    // Send the initial message with buttons and embed
    const message = await interaction.reply({
      embeds: [votingEmbed],
      components: [row],
    });

    // Create a filter to listen for button clicks
    const filter = i => {
      i.deferUpdate();
      return (i.customId === 'proponent' || i.customId === 'opponent');

      // return (
      //   (i.customId === "proponent" || i.customId === "opponent") &&
      //   !votedUsers.has(i.user.id)
      // );
    };

    // Create a collector for button clicks
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: time * 1000, // 60 seconds voting time
    });

    // Listen for button clicks
    collector.on("collect", i => {
      // votedUsers.add(i.user.id);
      const userId = i.user.id;

      // if (i.customId === "proponent") {
      //   proponents.value = (++proponents.value).toString();
      // } else if (i.customId === "opponent") {
      //   opponents.value = (++opponents.value).toString();
      // }

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
      const votingEmbed = new EmbedBuilder()
        .setColor("#3498db")
        .setTitle(`Plebiscyt kończy się <t:${parseInt(startTime / 1000) + time*60}:R>`)
        .setDescription(description)
        .addFields(proponents, opponents);

      // Edit the original message with updated embed
      message.edit({
        embeds: [votingEmbed],
        components: [row],
      });
    });

    // Listen for the end of the voting session
    collector.on("end", collected => {
      // Display the final results
      const votingEmbed = new EmbedBuilder()
        .setColor("#3498db")
        .setTitle(`Plebiscyt zakończony!`)
        .setDescription(description)
        .addFields(proponents, opponents);
      message.edit({
        embeds: [votingEmbed],
        components: [],
      });
      // interaction.followUp(
      //   `Finito! Za: ${proponents.value}, Przeciw: ${opponents.value}`
      // );
    });
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