const reactOnRectutation = require("../computings/reactOnRectutation");
const { PREFIX } = require("../config.json");
const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;
    // Odpowiedź na wiadomość prywatną
    if (message.guild === null)
      return message.author.send(
        "Siema! Niestety jeszcze nie potrafię nic robić w rozmowach prywatnych. Jeżeli chcesz poznać moje komendy wpisz /help na serwerze na którym jestem!"
      );
    // //Check if author is a client or the message was sent in dms and return
    // if (message.channel.type === 1) return; // 1-dm,

    //get PREFIX from config and prepare message so it can be read as a command
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    let args = messageArray.slice(1);

    //Check for PREFIX
    if (!cmd.startsWith(PREFIX)) return;
    //Get the command from the commands collection and then if the command is found run the command file
    let commandfile = client.commands.get(cmd.slice(PREFIX.length));
    if (commandfile) commandfile.run(client, message, args);

    if (cmd.includes("imie")) await reactOnRectutation(message);
    // checkLinks(message)
  },
};