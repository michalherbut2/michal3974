module.exports = async (message) => {
  // Sprawdź, czy autor wiadomości to nie bot i wiadomość nie jest z kanału DM
  if (message.author.bot || message.channel.type === 'DM') return;

  // Sprawdź, czy wiadomość zawiera link
  if (message.content.includes('http://') || message.content.includes('https://')) {
    // Wyślij wiadomość do kanału komendy w celu potwierdzenia
    message.delete()
    const confirmationMessage = await message.channel.send(`Czy na pewno chcesz wysłać linka? Odpowiedz na tę wiadomość \`Tak\` lub \`Nie\`.`);

    // Ustaw kolektor reakcji, aby zareagować na odpowiedzi adminów
    const filter = reaction => '👍👎'.includes(reaction.emoji.name);
    const collector = confirmationMessage.createReactionCollector({ filter, time: 300_000, dispose: true });
    
    // Dodaj reakcje do wiadomości
    await confirmationMessage.react('👍');
    await confirmationMessage.react('👎');

    // Czekaj na odpowiedź admina
    collector.once('collect', async (reaction) => {
      if (reaction.emoji.name === '👍') {
        // Admin zatwierdził, nie rób nic
        // await message.delete();
        await confirmationMessage.delete();
        await message.channel.send(message.content);
      } else {
        // Admin odrzucił, usuń wiadomość z potwierdzeniem
        await confirmationMessage.delete();
        await message.channel.send(`nie`);
      }
    });

    // Czekaj na zakończenie kolektora
    collector.once('end', (collected, reason) => {
      if (reason === 'time') {
        // Kolektor zakończył się z powodu przekroczenia czasu, usuń wiadomość z potwierdzeniem
        confirmationMessage.delete();
      }
    });
  }
}