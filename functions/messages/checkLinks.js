module.exports = async (message) => {
  try {
    // Check if the author of the message is a bot or if the message is from a DM channel
    if (message.author.bot || message.channel.type === 'DM') return;

    // Check if the message contains a link
    if (message.content.includes('http://') || message.content.includes('https://')) {
      // Delete the original message containing the link
      await message.delete();

      // Send a confirmation message to the channel
      const confirmationMessage = await message.channel.send(
        `Czy na pewno chcesz wysłać linka? Odpowiedz na tę wiadomość \`Tak\` lub \`Nie\`.`
      );

      // Define the filter for the reaction collector
      const filter = (reaction, user) => {
        return ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;
      };

      // Create the reaction collector
      const collector = confirmationMessage.createReactionCollector({ filter, time: 300000, dispose: true });

      // Add reactions to the confirmation message
      await confirmationMessage.react('👍');
      await confirmationMessage.react('👎');

      // Wait for admin's reaction
      collector.once('collect', async (reaction) => {
        if (reaction.emoji.name === '👍') {
          // Admin approved, send the original message content
          await confirmationMessage.delete();
          await message.channel.send(message.content);
        } else {
          // Admin rejected, delete the confirmation message
          await confirmationMessage.delete();
          await message.channel.send('Link został odrzucony.');
        }
      });

      // Handle the end of the collector
      collector.once('end', async (collected, reason) => {
        if (reason === 'time') {
          // The collector ended due to timeout, delete the confirmation message
          await confirmationMessage.delete();
          message.channel.send('Czas na odpowiedź minął. Link nie został wysłany.');
        }
      });
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};