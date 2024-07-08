const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
const sendEmbed = require("../../functions/messages/sendEmbed");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Super przerwa")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    const { targetId, guild } = interaction;
    const member = await guild.members.fetch(targetId);

    try {
      await member.timeout(28 * 24 * 60 * 60 * 1000); // 28 days

      sendEmbed(interaction, {
        description: `# ${member} dostał elegancką przerwę na 28 dni!`,
      });
    } catch (error) {
      console.error(error);
      sendEmbed(interaction, {
        description: `${member} niestety nie dostał elegancką przerwę na 28 dni`,
      });
    }
  },
};
