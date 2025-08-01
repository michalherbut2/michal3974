// Zakładamy, że 'client' jest już zainicjowany

// Tworzymy mapę do przechowywania gier i użytkowników, którzy ich szukają
const games = new Map();

client.commands = new Collection();

// Komenda /szukajgry
client.commands.set('szukajgry', {
    data: {
        name: 'szukajgry',
        description: 'Szukaj gry',
        options: [{
            name: 'gra',
            type: 'STRING',
            description: 'Nazwa gry, której szukasz',
            required: true,
        }],
    },
    async execute(interaction) {
        const game = interaction.options.getString('gra');
        const user = interaction.user.tag;

        // Dodajemy grę i użytkownika do mapy
        if (!games.has(game)) {
            games.set(game, []);
        }
        games.get(game).push(user);

        await interaction.reply(`Dodano Cię do listy osób szukających gry: ${game}`);
    },
});

// Komenda /gry
client.commands.set('gry', {
    data: {
        name: 'gry',
        description: 'Wyświetl dostępne gry',
    },
    async execute(interaction) {
        let response = 'Oto lista gier i osób, które ich szukają:\n';

        // Iterujemy przez mapę gier i wyświetlamy każdą grę i użytkowników, którzy jej szukają
        for (const [game, users] of games) {
            response += `**${game}**: ${users.join(', ')}\n`;
        }

        await interaction.reply(response);
    },
});

client.once('ready', () => {
    console.log('Bot jest gotowy!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania tej komendy!', ephemeral: true });
    }
});
