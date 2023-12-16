const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');

const commands = [
    {
        name: 'watykanczyk',
        description: 'Odtwarzanie dźwięku barki na kanale głosowym',
    },
];

const rest = new REST({ version: '9' }).setToken('YOUR_BOT_TOKEN_HERE');

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Replace 'YOUR_CLIENT_ID_HERE' with your actual bot client ID
        const clientId = 'YOUR_CLIENT_ID_HERE';

        // Pobierz listę gildii, do których bot jest dodany
        const guilds = await rest.get(
            Routes.userGuilds(clientId),
        );

        // Wybierz pierwszą gildię z listy (możesz dostosować to, aby wybrać odpowiednią gildię)
        const guildId = guilds[0]?.id;

        // Pobierz listę komend dla danej gildii
        const existingCommands = await rest.get(
            Routes.applicationGuildCommands(clientId, guildId),
        );

        // Usuń istniejące komendy (opcjonalne)
        if (existingCommands.length > 0) {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: [] },
            );
            console.log('Cleared existing application (/) commands.');
        }

        // Ustaw nowe komendy
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

function remindAndPlayMusic() {
    // Wyslij przypomnienie
    const guildId = 'YOUR_GUILD_ID_HERE'; // Replace with your guild ID
    const guild = 'YOUR_GUILD_ID_HERE'; // Replace with your guild ID

    const textChannels = guild.channels.cache.filter(channel => channel.isText());

    if (textChannels.size > 0) {
        const randomTextChannel = textChannels.random();
        randomTextChannel.send('Przypomnienie! Odpal barkę!');

        // Sprawdź wszystkie kanały głosowe na serwerze
        guild.channels.cache.forEach(channel => {
            if (channel.isVoice()) {
                const members = channel.members;
                if (members.size > 0) {
                    // Wejdź na kanał głosowy i odtwórz muzykę
                    try {
                        const connection = joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                        });

                        const player = createAudioPlayer();
                        const resource = createAudioResource(createReadStream('barka.mp3'));

                        player.play(resource);
                        connection.subscribe(player);

                        player.on(VoiceConnectionStatus.Ready, () => {
                            console.log('Bot dołączył do kanału i puszczono dźwięk barki.');
                        });
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        });
    }
}
