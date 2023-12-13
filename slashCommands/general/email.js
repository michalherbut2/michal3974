const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'twoj-email@gmail.com', // Zastąp swoim adresem e-mail
    pass: 'twoje-haslo', // Zastąp swoim hasłem
  },
});

const clientId = 'TWÓJ_ID_BOTA'; // Zastąp swoim ID bota
const guildId = 'TWÓJE_ID_GUILDII'; // Zastąp swoim ID serwera/gildii

const commands = [
  {
    name: 'sendemail',
    description: 'Wysyła e-mail do określonego odbiorcy',
    options: [
      {
        name: 'recipient',
        type: 'STRING',
        description: 'Adres e-mail odbiorcy',
        required: true,
      },
      {
        name: 'subject',
        type: 'STRING',
        description: 'Temat e-maila',
        required: true,
      },
      {
        name: 'content',
        type: 'STRING',
        description: 'Treść e-maila',
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '9' }).setToken('TWÓJ_TOKEN_BOTA');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const handleSendEmail = async (interaction) => {
  const recipientEmail = interaction.options.getString('recipient');
  const subject = interaction.options.getString('subject');
  const content = interaction.options.getString('content');

  const mailOptions = {
    from: 'twoj-email@gmail.com', // Zastąp swoim adresem e-mail
    to: recipientEmail,
    subject: subject,
    text: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail wysłany: ' + info.response);
    await interaction.reply('E-mail został wysłany pomyślnie!');
  } catch (error) {
    console.error(error);
    await interaction.reply('Wystąpił błąd podczas wysyłania e-maila.');
  }
};

module.exports = {
  data: {
    name: 'sendemail',
    description: 'Wysyła e-mail do określonego odbiorcy',
    options: commands[0].options,
  },
  async execute(interaction) {
    await handleSendEmail(interaction);
  },
};
