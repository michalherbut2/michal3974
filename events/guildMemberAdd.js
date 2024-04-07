const { Events, PermissionFlagsBits } = require("discord.js");
const sendEmbed = require("../computings/messages/sendEmbed");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,

  once: false,

  async execute(member, client) {
    // add basic roles
    const { guild } = member;

    // hanlde an invite
    // check bot permission to work with invites (ManageGuild)
    const clientMember = guild.members.cache.get(client.user.id);

    // if (!clientMember.permissions.has(PermissionFlagsBits.ManageGuild))
    //   return console.log("no permissions to check invites");

    // find current invite
    const newInvites = await guild.invites.fetch();

    const oldInvites = client.invites.get(guild.id);

    const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));

    if (!invite) return console.log("I cannot check who joined the server!");

    // find welcom channel
    const channel = guild.channels.cache.find(c =>
      c.name.includes("wejście-wyjście")
    );

    try {
      if (!channel) throw new Error("There is no channel 'welcome'");

      member.channel = channel;

      const mess = `${invite.inviter} zaprosił ${member}!`;

      console.log("przywitanie");

      sendEmbed(channel, { description: mess });

      console.log("przywitanie wysłane");
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", error);
    }
  },
};
