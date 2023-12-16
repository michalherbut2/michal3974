const Discord = require('discord.js');
const Parser = require('rss-parser');
const cron = require('node-cron');

const client = new Discord.Client();
const newsChannelName = 'ogloszenia';
const polandNewsFeedUrl = 'https://wiadomosci.wp.pl/rss.xml';
const gameUpdatesFeedUrl = 'https://www.gog.com/rss/releases.xml';

const parser = new Parser();

client.once('ready', () => {
    console.log(`Zalogowano jako ${client.user.tag}`);
    // Ustaw harmonogram wysyłania informacji o godzinach 8:00, 12:00 oraz 18:00
    cron.schedule('0 8,12,18 * * *', sendNews);
});

async function sendNews() {
    try {
        // Pobierz najnowsze wiadomości o Polsce z serwisu RSS
        const polandFeed = await parser.parseURL(polandNewsFeedUrl);
        const polandLatestNews = polandFeed.items.map(item => item.title);

        // Pobierz najnowsze informacje o aktualizacjach gry z serwisu RSS
        const gameUpdatesFeed = await parser.parseURL(gameUpdatesFeedUrl);
        const gameLatestUpdates = gameUpdatesFeed.items.map(item => item.title);

        // Pobierz kanał ogłoszeniowy na każdym serwerze, na którym jest bot
        client.guilds.cache.forEach(guild => {
            const announcementChannel = guild.channels.cache.find(channel => channel.name === newsChannelName);

            if (announcementChannel) {
                // Przygotuj osadzoną wiadomość z informacjami o Polsce i aktualizacjach gry
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('🌐 Najnowsze wiadomości')
                    .addField('🇵🇱 Polska', polandLatestNews.join('\n'))
                    .addField('🎮 Aktualizacje gry', gameLatestUpdates.join('\n'));

                // Wyślij osadzoną wiadomość
                announcementChannel.send(embed);
            }
        });
    } catch (error) {
        console.error('Błąd podczas pobierania informacji o nowościach:', error.message);
    }
}


