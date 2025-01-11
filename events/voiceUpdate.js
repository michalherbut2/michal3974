const { Events } = require("discord.js");
// const resetUserInactivity = require("../functions/time/resetUserInactivity");
// const notifyModerators = require("../functions/messages/notifyModerators");

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState, client) {
    try {
      // Ignore bots
      if (newState.member.user.bot) return;

      console.log(
        `${newState.member.user.tag} dołączył do kanału głosowego ${newState?.channel?.name}.`
      );

      // Notify moderators if an unverified user joins the verification channel
      // notifyModerators(newState);

      // Check activity and remove roles if necessary
      const interval = client.inactivity.get(newState.guild.id);

      if (interval && !interval?._destroyed) {
        // resetUserInactivity(newState.member.user.id, newState.guild.id);
      }
    } catch (error) {
      console.error("Error handling VoiceStateUpdate event:", error);
    }
  },
};