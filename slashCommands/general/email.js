const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const nodemailer = require('nodemailer');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const commands = [
  {
    name: 'sendemail',
    description: 'Wysyła e-mail do określonego odbiorcy',
    options: [
      {
        name: 'recipient',
        type: 'USER',
        description: 'Użytkownik, do którego ma być wysłany e-mail',
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

const clientId = 'TWÓJ_ID_BOTA'; // Zastąp swoim ID bota
const guildId = 'TWÓJE_ID_GUILDII'; // Zastąp swoim ID serwera/gildii

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

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'sendemail') {
    const recipient = options.getUser('recipient');
    const subject = options.getString('subject');
    const content = options.getString('content');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'twoj-email@gmail.com', // Zastąp swoim adresem e-mail
        pass: 'twoje-haslo', // Zastąp swoim hasłem
      },
    });

    const mailOptions = {
      from: 'twoj-email@gmail.com', // Zastąp swoim adresem e-mail
      to: recipient.email,
      subject: subject,
      text: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return interaction.reply('Wystąpił błąd podczas wysyłania e-maila.');
      }
      console.log('E-mail wysłany: ' + info.response);
      interaction.reply('E-mail został wysłany pomyślnie!');
    });
  }
});


