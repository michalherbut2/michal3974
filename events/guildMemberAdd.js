const { Events, PermissionFlagsBits } = require("discord.js");
const sendEmbed = require("../functions/messages/sendEmbed");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,

  async execute(member, client) {
    const { guild } = member;
    
    // Get the client member to check permissions
    const clientMember = guild.members.cache.get(client.user.id);

    if (!clientMember.permissions.has(PermissionFlagsBits.ManageGuild)) {
      console.log(`No permissions to check invites on ${guild.name} (${guild.id})`);
      return;
    }

    try {
      // Fetch current invites
      const newInvites = await guild.invites.fetch();
      const oldInvites = client.invites.get(guild.id);

      // Find the invite that was used
      const invite = newInvites.find(i => i.uses > (oldInvites.get(i.code)?.uses || 0));

      if (!invite) {
        console.log("Cannot determine who invited the new member.");
        return;
      }

      // Find the welcome channel
      const channel = guild.channels.cache.find(c => c.name.includes("wejście-wyjście"));

      if (!channel) {
        throw new Error("There is no channel 'wejście-wyjście'");
      }

      // Send the welcome message
      const mess = `${invite.inviter} zaprosił ${member} kodem ${invite.code}!`;
      console.log("Sending welcome message...");

      await sendEmbed(channel, { description: mess });

      console.log("Welcome message sent.");
    } catch (error) {
      console.error("Error handling GuildMemberAdd event:", error);
    }
  },
};