const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");
const sendEmbed = require("../../functions/messages/sendEmbed");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Super przerwa")
    .setType(ApplicationCommandType.User),

  async execute(interaction) {
    const { targetId, guild, member: executingMember } = interaction;

    try {
      // Fetch the target member
      const member = await guild.members.fetch(targetId);

      // Check if the executing member has the required permissions
      if (!executingMember.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        throw new Error("You do not have permission to timeout members.");
      }

      // Timeout the member for 28 days
      await member.timeout(28 * 24 * 60 * 60 * 1000); // 28 days

      // Send success message
      await sendEmbed(interaction, {
        description: `${member} dostał elegancką przerwę na 28 dni!`,
      });

    } catch (error) {
      console.error("Error executing superTimeout command:", error.message);

      // Send error message
      await sendEmbed(interaction, {
        description: `An error occurred: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};