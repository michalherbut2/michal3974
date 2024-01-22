const { Events } = require("discord.js");
const resetUserInactivity = require("../computings/resetUserInactivity");

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState, client) {
    if (newState.member.user.bot) return;
    console.log(
      `${newState.member.user.tag} dołączył do kanału głosowego ${newState?.channel?.name}.`
    );
    // console.log(newState);
    // Sprawdzanie, czy użytkownik wszedł na konkretny kanał głosowy
    const targetVoiceChannelId = "1198762609571278908";
    if (newState.channelId === targetVoiceChannelId) {
      // Pobierz kanał tekstowy, na którym chcesz wysłać wiadomość
      const targetTextChannel = newState.guild.channels.cache.get("1198719827020370001");

      // Sprawdź, czy kanał tekstowy istnieje
      if (targetTextChannel) {
        // Wyślij wiadomość na kanał tekstowy
        const userName = newState.member.displayName;

        // Wyślij wiadomość na kanał tekstowy z nazwą użytkownika
        targetTextChannel.send(`## ${userName} wszedł na <#1198762609571278908>! <@1049729342420287508> idź go zweryfikować!`);
      } else {
        console.error("Kanał tekstowy nie został znaleziony.");
      }
    }
    

    const interval = client.inactivity.get(newState.guild.id);
    
    if (interval && !interval?._destroyed)
      resetUserInactivity(newState.member.user.id, newState.guild.id);
  },
};
