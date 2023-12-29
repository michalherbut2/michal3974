const { createSimpleEmbed } = require("../../computings/createEmbed");
const ServerQueue = require("../../models/ServerQueue");

module.exports = {
  config: {
    name: "reset",
    description: "Opróżnij starą kolejkę muzyczną i utwórz nową",
    usage: `reset`,
  },

  run: async (client, message, args) => {
    try {
      const guildId = message.guild.id;

      // Sprawdź, czy istnieje aktywna kolejka dla tego serwera
      if (client.queue.has(guildId)) {
        // Pobierz starą kolejkę i zniszcz ją
        const oldQueue = client.queue.get(guildId);
        oldQueue.destroy(); // Przyjmuję, że ServerQueue ma metodę destroy do opróżnienia kolejki

        // Utwórz nową kolejkę
        client.queue.set(guildId, new ServerQueue());

        // Udziel informacji zwrotnej użytkownikowi
        message.channel.send({
          embeds: [createSimpleEmbed(`Stara kolejka muzyczna została opróżniona, a nowa została utworzona 🎵`)],
        });
      } else {
        // Jeśli nie ma starej kolejki, po prostu utwórz nową
        client.queue.set(guildId, new ServerQueue());

        // Udziel informacji zwrotnej użytkownikowi
        message.channel.send({
          embeds: [createSimpleEmbed(`Utworzono nową kolejkę muzyczną 🎵`)],
        });
      }
    } catch (error) {
      console.error(error);

      // Udziel informacji o błędzie użytkownikowi
      message.channel.send({
        embeds: [
          createSimpleEmbed(`Wystąpił błąd podczas resetowania kolejki: ${error.message}`, "red"),
        ],
      });
    }
  },
};
