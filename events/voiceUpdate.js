const { Events } = require("discord.js");
const resetUserInactivity = require("../computings/resetUserInactivity");

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState, client) {
    if (newState.member.user.bot) return;
    const interval = client.inactivity.get(newState.guild.id);
    // console.log(
    //   `${newState.member.user.tag} dołączył do kanału głosowego ${newState.channel.name}.`
    // );
    if (interval && !interval?._destroyed)
      resetUserInactivity(newState.member.user.id, newState.guild.id);
  },
};
