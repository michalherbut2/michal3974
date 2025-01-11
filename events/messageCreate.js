const reactOnRectutation = require("../functions/messages/reactOnRectutation");
const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message, client) {
    try {
      // Ignore messages from bots
      if (message.author.bot) return;

      // Respond to direct messages
      if (!message.guild) {
        return message.author.send(
          "Siema! Niestety jeszcze nie potrafię nic robić w rozmowach prywatnych. Jeżeli chcesz poznać moje komendy wpisz /help na serwerze na którym jestem!"
        ).catch(error => {
          console.error("Failed to send DM:", error);
        });
      }

      // Split the message content into an array of words
      const messageArray = message.content.split(" ");
      // Normalize and lowercase the first word to check for the command
      const cmd = messageArray[0]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      // Check if the command includes "imie"
      if (cmd.includes("imie")) {
        await reactOnRectutation(message).catch(error => {
          console.error("Error executing reactOnRectutation:", error);
        });
      }
    } catch (error) {
      console.error("Error handling message create event:", error);
    }
  },
};