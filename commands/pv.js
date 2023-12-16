const Discord = require('discord.js');

// Prefix bota
const prefix = '/';

// Event obsługujący wiadomości
client.on('message', (message) => {
  // Sprawdzamy, czy wiadomość nie jest od bota oraz czy jest wiadomością prywatną
  if (!message.author.bot && message.channel.type === 'dm') {
    // Odpowiedź na wiadomość prywatną
    message.author.send("Siema! Niestety jeszcze nie potrafię nic robić w rozmowach prywatnych. Jeżeli chcesz poznać moje komendy wpisz /help na serwerze na którym jestem!");
  }
