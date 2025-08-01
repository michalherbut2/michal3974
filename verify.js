// Załóżmy, że 'client' jest już zainicjowany i przekazany do tego skryptu
const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./users.db');

client.once('ready', () => {
    console.log(`Bot is ready as: ${client.user.tag}`);
    db.exec("CREATE TABLE IF NOT EXISTS users (id TEXT, server TEXT, verified INTEGER, lastActive INTEGER)");

    client.guilds.cache.each(guild => {
        guild.commands.create({
            name: 'weryfikuj',
            description: 'Weryfikuje użytkownika',
            options: [{
                name: 'user',
                type: 'USER',
                description: 'Użytkownik do zweryfikowania',
                required: true,
            }],
        });

        guild.members.fetch().then(members => {
            members.each(member => {
                db.prepare("INSERT OR IGNORE INTO users (id, server, verified, lastActive) VALUES (?, ?, ?, ?)").run(member.id, guild.id, 0, Date.now());
            });
        });
    });
});

client.on('guildMemberAdd', member => {
    db.prepare("INSERT OR IGNORE INTO users (id, server, verified, lastActive) VALUES (?, ?, ?, ?)").run(member.id, member.guild.id, 0, Date.now());
    let role = member.guild.roles.cache.find(role => role.name === "Weryfikacja");
    member.roles.add(role).catch(console.error);
    let adminRole = member.guild.roles.cache.find(role => role.name === "Admin");
    let adminChannel = member.guild.channels.cache.find(channel => channel.name === "admin-channel");
    if(adminRole && adminChannel) {
        adminChannel.send(`${adminRole}, nowa osoba czeka na weryfikację.`);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'weryfikuj') {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return;
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        db.prepare("UPDATE users SET verified = 1 WHERE id = ? AND server = ?").run(member.id, member.guild.id);
        let role = member.guild.roles.cache.find(role => role.name === "Zweryfikowany");
        member.roles.add(role).catch(console.error);
        await interaction.reply(`${member.user.tag} został zweryfikowany.`);
    }
});

client.on('messageCreate', message => {
    if (!message.author.bot) {
        db.prepare("UPDATE users SET lastActive = ? WHERE id = ? AND server = ?").run(Date.now(), message.author.id, message.guild.id);
        checkActivity(message.author.id, message.guild.id);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member && !newState.member.user.bot) {
        db.prepare("UPDATE users SET lastActive = ? WHERE id = ? AND server = ?").run(Date.now(), newState.member.id, newState.guild.id);
        checkActivity(newState.member.id, newState.guild.id);
    }
});

function checkActivity(userId, guildId) {
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const user = db.prepare("SELECT id, server FROM users WHERE id = ? AND server = ? AND lastActive < ? AND verified = 1").get(userId, guildId, oneMonthAgo);
    if (user) {
        const guild = client.guilds.cache.get(user.server);
        const member = guild.members.cache.get(user.id);
        if (member) {
            let role = member.guild.roles.cache.find(role => role.name === "Zweryfikowany");
            member.roles.remove(role).catch(console.error);
            db.prepare("UPDATE users SET verified = 0 WHERE id = ? AND server = ?").run(member.id, member.guild.id);
        }
    }
}
