const { Events } = require("discord.js");
// const resetUserInactivity = require("../functions/time/resetUserInactivity");
// const notifyModerators = require("../functions/messages/notifyModerators");

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState, client) {
    // if (newState.member.user.bot) return;
    // console.log(
    //   `${newState.member.user.tag} dołączył do kanału głosowego ${newState?.channel?.name}.`
    // );

    // notify moderators unverified user joined in verifacation channel
    // notifyModerators(newState);

    // code use to check activity and remove roles
    // const interval = client.inactivity.get(newState.guild.id);

    // if (interval && !interval?._destroyed)
    //   resetUserInactivity(newState.member.user.id, newState.guild.id);
  },
};
