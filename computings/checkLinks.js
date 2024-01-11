const Discord = require('discord.js');

module.exports = async (message) => {
  // Check if the author is not a bot and the message is not from a direct message (DM)
  if (message.author.bot || message.channel.type === 'DM') return;

  // Check if the message contains a link (http:// or https://)
  if (message.content.includes('http://') || message.content.includes('https://')) {
    // Delete the original message
    message.delete();

    // Create an embed for the confirmation message
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Potwierdzenie Wysłania Linka')
      .setDescription(`Czy na pewno chcesz wysłać linka?\nOdpowiedz na tę wiadomość \`👍 Tak\` lub \`👎 Nie\`.`);

    // Send the embed as the confirmation message
    const confirmationMessage = await message.channel.send(embed);

    // Add reactions to the confirmation message
    await confirmationMessage.react('👍');
    await confirmationMessage.react('👎');

    // Set up a reaction collector for admin responses
    const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
    const collector = confirmationMessage.createReactionCollector({ filter, time: 300000, dispose: true });

    // Wait for an admin response
    collector.once('collect', async (reaction) => {
      if (reaction.emoji.name === '👍') {
        // Admin approved, delete the confirmation message and send the original message content
        await confirmationMessage.delete();
        await message.channel.send(message.content);
      } else {
        // Admin rejected, delete the confirmation message and send a response
        await confirmationMessage.delete();
        await message.channel.send(`nie`);
      }
    });

    // Handle collector end (timeout)
    collector.once('end', (collected, reason) => {
      if (reason === 'time') {
        // Collector ended due to timeout, delete the confirmation message
        confirmationMessage.delete();
      }
    });
  }
};
