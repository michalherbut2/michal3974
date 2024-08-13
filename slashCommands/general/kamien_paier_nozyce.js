const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
    new SlashCommandBuilder().setName('rps').setDescription('Zagraj w kamień, papier, nożyce!').addStringOption(option =>
        option.setName('move')
            .setDescription('Twój ruch')
            .setRequired(true)
            .addChoice('Kamień', 'rock')
            .addChoice('Papier', 'paper')
            .addChoice('Nożyce', 'scissors')
    ),
].map(command => command.toJSON());

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'rps') {
        const userMove = interaction.options.getString('move');
        const possibleMoves = ['rock', 'paper', 'scissors'];
        const botMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

        let result;
        if (userMove === botMove) {
            result = 'Remis!';
        } else if (
            (userMove === 'rock' && botMove === 'scissors') ||
            (userMove === 'paper' && botMove === 'rock') ||
            (userMove === 'scissors' && botMove === 'paper')
        ) {
            result = 'Wygrałeś!';
        } else {
            result = 'Przegrałeś!';
        }

        await interaction.reply(`Twój ruch: ${userMove}, mój ruch: ${botMove}. ${result}`);
    }
});
