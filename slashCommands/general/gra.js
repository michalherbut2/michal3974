const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

let games = {};

const playGameCommand = {
    data: new SlashCommandBuilder()
        .setName('playgra')
        .setDescription('Zagraj w grę kółko i krzyżyk!')
        .addStringOption(option =>
            option.setName('position')
                .setDescription('Pozycja, na której chcesz zagrać')
                .setRequired(true)
        ),
    async execute(interaction) {
        let position = interaction.options.getString('position');
        let row = Math.floor((position - 1) / 3);
        let col = (position - 1) % 3;

        let game = games[interaction.guildId];
        if (!game) {
            game = {
                board: [
                    ['1', '2', '3'],
                    ['4', '5', '6'],
                    ['7', '8', '9']
                ],
                currentPlayer: 'X'
            };
            games[interaction.guildId] = game;
        }

        if (game.board[row][col] !== 'X' && game.board[row][col] !== 'O') {
            game.board[row][col] = game.currentPlayer;
            game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        }

        await interaction.reply(`\`\`\`${game.board.map(row => row.join(' | ')).join('\n')}\`\`\``);
    }
};

module.exports = playGameCommand;
