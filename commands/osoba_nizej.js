const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageActionRow, MessageButton, MessageComponentInteraction } = require('discord.js');

// ID kanału, na którym ma działać gra
const channelId = 'TWOJE-ID-KANAŁU';

client.on('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  try {
    if (message.channel.id === channelId && message.content.startsWith('!question')) {
      const question = message.content.slice(10); // Usuń '!question ' z treści wiadomości, aby uzyskać pytanie

      // Stwórz webhook dla użytkownika
      const webhook = await message.channel.createWebhook(message.author.username, {
        avatar: message.author.displayAvatarURL(),
      });

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('yes')
            .setLabel('Tak')
            .setStyle('SUCCESS'),
          new MessageButton()
            .setCustomId('no')
            .setLabel('Nie')
            .setStyle('DANGER')
        );

      // Wyślij pytanie jako webhook
      await webhook.send({ content: `Czy osoba poniżej ${question}?`, components: [row] });

      // Usuń webhook po użyciu
      webhook.delete();
    }
  } catch (error) {
    console.error(`Wystąpił błąd podczas tworzenia webhooka: ${error}`);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'yes' || interaction.customId === 'no') {
      const modal = new ModalBuilder()
        .setCustomId('questionModal')
        .setTitle('Nowe pytanie')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('questionInput')
              .setLabel('Wpisz swoje pytanie')
              .setPlaceholder('Czy osoba poniżej...')
              .setStyle(TextInputStyle.Short)
          )
        );

      await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'questionModal') {
      const newQuestion = interaction.values.get('questionInput');
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('yes')
            .setLabel('Tak')
            .setStyle('SUCCESS'),
          new MessageButton()
            .setCustomId('no')
            .setLabel('Nie')
            .setStyle('DANGER')
        );

      // Stwórz webhook dla użytkownika
      const webhook = await interaction.channel.createWebhook(interaction.user.username, {
        avatar: interaction.user.displayAvatarURL(),
      });

      // Wyślij pytanie jako webhook
      await webhook.send({ content: `Czy osoba poniżej ${newQuestion}?`, components: [row] });

      // Usuń webhook po użyciu
      webhook.delete();

      await interaction.reply({ content: 'Twoje pytanie zostało wysłane!', ephemeral: true });
    }
  } catch (error) {
    console.error(`Wystąpił błąd podczas obsługi interakcji: ${error}`);
  }
});

