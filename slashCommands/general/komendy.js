const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, GatewayIntentBits } = require('discord.js');

const clientId = 'TWÓJ_CLIENT_ID';
const guildId = 'TWÓJ_GUILD_ID';

const commands = [
  {
    data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Banuje użytkownika z serwera')
      .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do zbanowania').setRequired(true)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('użytkownik');
      const guild = interaction.guild;

      try {
        if (!guild.me.permissions.has('BAN_MEMBERS')) {
          return interaction.reply('Nie mam wystarczających uprawnień do zbanowania użytkownika.');
        }

        await guild.members.ban(targetUser.id);
        interaction.reply(`Zbanowano użytkownika: ${targetUser.tag}`);
      } catch (error) {
        console.error(`Error banning user ${targetUser.tag}:`, error);
        interaction.reply('Wystąpił błąd podczas banowania użytkownika.');
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Wyrzuca użytkownika z serwera')
      .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do wyrzucenia').setRequired(true)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('użytkownik');
      const guild = interaction.guild;

      try {
        if (!guild.me.permissions.has('KICK_MEMBERS')) {
          return interaction.reply('Nie mam wystarczających uprawnień do wyrzucenia użytkownika.');
        }

        await guild.members.kick(targetUser.id);
        interaction.reply(`Wyrzucono użytkownika: ${targetUser.tag}`);
      } catch (error) {
        console.error(`Error kicking user ${targetUser.tag}:`, error);
        interaction.reply('Wystąpił błąd podczas wyrzucania użytkownika.');
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('mute')
      .setDescription('Wycisza użytkownika na serwerze')
      .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do wyciszenia').setRequired(true)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('użytkownik');
      const guild = interaction.guild;

      try {
        // Dodaj logikę do wyciszania użytkownika
        interaction.reply(`Wyciszono użytkownika: ${targetUser.tag}`);
      } catch (error) {
        console.error(`Error muting user ${targetUser.tag}:`, error);
        interaction.reply('Wystąpił błąd podczas wyciszania użytkownika.');
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('unmute')
      .setDescription('Odblokowuje użytkownika z wyciszenia na serwerze')
      .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do odblokowania').setRequired(true)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('użytkownik');

      try {
        // Dodaj logikę do odblokowania użytkownika z wyciszenia
        interaction.reply(`Odblokowano użytkownika z wyciszenia: ${targetUser.tag}`);
      } catch (error) {
        console.error(`Error unmuting user ${targetUser.tag}:`, error);
        interaction.reply('Wystąpił błąd podczas odblokowywania użytkownika z wyciszenia.');
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('set_role')
      .setDescription('Nadaje użytkownikowi rolę na serwerze')
      .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik, któremu nadano rolę').setRequired(true))
      .addRoleOption(option => option.setName('rola').setDescription('Rola do nadania użytkownikowi').setRequired(true)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('użytkownik');
      const targetRole = interaction.options.getRole('rola');

      try {
        // Dodaj logikę do nadawania roli użytkownikowi
        interaction.reply(`Nadano rolę ${targetRole.name} użytkownikowi ${targetUser.tag}`);
      } catch (error) {
        console.error(`Error setting role for user ${targetUser.tag}:`, error);
        interaction.reply('Wystąpił błąd podczas nadawania roli użytkownikowi.');
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('remove_role')
      .setDescription('Usuwa użytkownikowi rolę na serwerze')
      .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik, któremu usunięto rolę').setRequired(true))
      .addRoleOption(option => option.setName('rola').setDescription('Rola do usunięcia użytkownikowi').setRequired(true)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('użytkownik');
      const targetRole = interaction.options.getRole('rola');

      try {
        // Dodaj logikę do usuwania roli użytkownikowi
        interaction.reply(`Usunięto rolę ${targetRole.name} użytkownikowi ${targetUser.tag}`);
      } catch (error) {
        console.error(`Error removing role for user ${targetUser.tag}:`, error);
        interaction.reply('Wystąpił błąd podczas usuwania roli użytkownikowi.');
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('change_nick')
      .setDescription('Zmienia nick użytkownika na serwerze')
      .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik, któremu zmieniono nick').setRequired(true))
      .addStringOption(option => option.setName('nowy_nick').setDescription('Nowy nick użytkownika').setRequired(true)),
    execute: async (interaction) => {
      const targetUser = interaction.options.getUser('użytkownik');
      const newNick = interaction.options.getString('nowy_nick');

      try {
        // Dodaj logikę do zmiany nicku użytkownika
        interaction.reply(`Zmieniono nick użytkownika ${targetUser.tag} na ${newNick}`);
      } catch (error) {
        console.error(`Error changing nickname for user ${targetUser.tag}:`, error);
        interaction.reply('Wystąpił błąd podczas zmiany nicku użytkownika.');
      }
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('roll')
      .setDescription('Losuje liczbę z zakresu od 1 do 100'),
    execute: async (interaction) => {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      interaction.reply(`Wylosowano liczbę: ${randomNumber}`);
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('dice')
      .setDescription('Losuje liczbę z zakresu od 1 do 6'),
    execute: async (interaction) => {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      interaction.reply(`Wyrzucono kostką: ${diceResult}`);
    },
  },
  {
    data: new SlashCommandBuilder()
      .setName('time')
      .setDescription('Wyświetla aktualną godzinę i datę'),
    execute: async (interaction) => {
      const currentTime = new Date();
      interaction.reply(`Aktualna godzina i data: ${currentTime.toLocaleString()}`);
    },
  },
];

const rest = new REST({ version: '9' }).setToken('TWÓJ_BOT_TOKEN');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands.map(command => command.data.toJSON()) },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();



const handleCommands = (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  const command = commands.find(cmd => cmd.data.name === commandName);
  if (command) {
    try {
      command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      interaction.reply({ content: 'Wystąpił błąd podczas wykonywania tej komendy!', ephemeral: true });
    }
  }
};

client.on('interactionCreate', handleCommands);


