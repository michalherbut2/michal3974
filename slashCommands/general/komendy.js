const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const clientId = 'TWÓJ_CLIENT_ID';
const guildId = 'TWÓJ_GUILD_ID';
const commands = [
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banuje użytkownika z serwera')
    .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do zbanowania').setRequired(true)),
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Wyrzuca użytkownika z serwera')
    .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do wyrzucenia').setRequired(true)),
  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Wycisza użytkownika na serwerze')
    .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do wyciszenia').setRequired(true)),
  new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Odblokowuje użytkownika z wyciszenia na serwerze')
    .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik do odblokowania').setRequired(true)),
  new SlashCommandBuilder()
    .setName('set_role')
    .setDescription('Nadaje użytkownikowi rolę na serwerze')
    .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik, któremu nadano rolę').setRequired(true))
    .addRoleOption(option => option.setName('rola').setDescription('Rola do nadania użytkownikowi').setRequired(true)),
  new SlashCommandBuilder()
    .setName('remove_role')
    .setDescription('Usuwa użytkownikowi rolę na serwerze')
    .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik, któremu usunięto rolę').setRequired(true))
    .addRoleOption(option => option.setName('rola').setDescription('Rola do usunięcia użytkownikowi').setRequired(true)),
  new SlashCommandBuilder()
    .setName('change_nick')
    .setDescription('Zmienia nick użytkownika na serwerze')
    .addUserOption(option => option.setName('użytkownik').setDescription('Użytkownik, któremu zmieniono nick').setRequired(true))
    .addStringOption(option => option.setName('nowy_nick').setDescription('Nowy nick użytkownika').setRequired(true)),
  new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Losuje liczbę z zakresu od 1 do 100'),
  new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Losuje liczbę z zakresu od 1 do 6'),
  new SlashCommandBuilder()
    .setName('time')
    .setDescription('Wyświetla aktualną godzinę i datę'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken('TWÓJ_BOT_TOKEN');

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

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Dynamiczna rejestracja komend na wszystkich serwerach
  for (const guild of client.guilds.cache.values()) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guild.id),
        { body: commands },
      );
      console.log(`Successfully registered commands on ${guild.name}`);
    } catch (error) {
      console.error(`Failed to register commands on ${guild.name}:`, error);
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'ban') {
    const targetUser = options.getUser('użytkownik');
    interaction.reply(`Zbanowano użytkownika: ${targetUser.tag}`);
    // Kod do zbanowania użytkownika
  } else if (commandName === 'kick') {
    const targetUser = options.getUser('użytkownik');
    interaction.reply(`Wyrzucono użytkownika: ${targetUser.tag}`);
    // Kod do wyrzucenia użytkownika
  } else if (commandName === 'mute') {
    const targetUser = options.getUser('użytkownik');
    interaction.reply(`Wyciszono użytkownika: ${targetUser.tag}`);
    // Kod do wyciszenia użytkownika
  } else if (commandName === 'unmute') {
    const targetUser = options.getUser('użytkownik');
    interaction.reply(`Odblokowano użytkownika z wyciszenia: ${targetUser.tag}`);
    // Kod do odblokowania użytkownika z wyciszenia
  } else if (commandName === 'set_role') {
    const targetUser = options.getUser('użytkownik');
    const targetRole = options.getRole('rola');
    interaction.reply(`Nadano rolę ${targetRole.name} użytkownikowi ${targetUser.tag}`);
    // Kod do nadawania roli użytkownikowi
  } else if (commandName === 'remove_role') {
    const targetUser = options.getUser('użytkownik');
    const targetRole = options.getRole('rola');
    interaction.reply(`Usunięto rolę ${targetRole.name} użytkownikowi ${targetUser.tag}`);
    // Kod do usuwania roli użytkownikowi
  } else if (commandName === 'change_nick') {
    const targetUser = options.getUser('użytkownik');
    const newNick = options.getString('nowy_nick');
    interaction.reply(`Zmieniono nick użytkownika ${targetUser.tag} na ${newNick}`);
    // Kod do zmiany nicku użytkownika
  } else if (commandName === 'roll') {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    interaction.reply(`Wylosowano liczbę: ${randomNumber}`);
  } else if (commandName === 'dice') {
    const diceResult = Math.floor(Math.random() * 6) + 1;
    interaction.reply(`Wyrzucono kostką: ${diceResult}`);
  } else if (commandName === 'time') {
    const currentTime = new Date();
    interaction.reply(`Aktualna godzina i data: ${currentTime.toLocaleString()}`);
  }
});
