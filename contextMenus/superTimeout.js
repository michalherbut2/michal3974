const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ActionRowBuilder,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
} = require("discord.js");
const sendEmbed = require("../computings/messages/sendEmbed");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Super przerwa")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    const { targetId, guild } = interaction;
    const member = await guild.members.fetch(targetId);

    // const modal = new ModalBuilder()
    //   .setCustomId("superTimeout")
    //   .setTitle("Super Przerwa");

    // // Add components to modal
    // const confirm = new TextInputBuilder()
    //   .setCustomId("confirm")
    //   .setLabel("Chcesz dać przerwę na 28 dni? [tak/nie]")
    //   .setStyle(TextInputStyle.Short);

    // const reason = new TextInputBuilder()
    //   .setCustomId("reason")
    //   .setLabel("Powód przerwy na 28 dni")
    //   .setStyle(TextInputStyle.Short);

    // modal.addComponents(
    //   [confirm, reason].map(input =>
    //     new ActionRowBuilder().addComponents(input)
    //   )
    // );

    // interaction.showModal(modal);

    // member.timeout(28 * 24 * 60 * 60 * 1000, reason); // 28 days
    try {
      member.timeout(28 * 24 * 60 * 60 * 1000); // 28 days
      // // await interaction.reply({ embeds: [createEmbed("Komendy", content)] });
  
      sendEmbed(interaction, {
        description: `${member} dostał elegancką przerwę na 28 dni`,
      });
      
    } catch (error) {
      console.error(error);
      sendEmbed(interaction, {
        description: `${member} niestety nie dostał elegancką przerwę na 28 dni`,
      });
    }
  },
};
