const { GatewayIntentBits, MessageEmbed } = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database('xp_database.db');

const achievements = {
    2: 'Osiągnięcie za osiągnięcie poziomu 2',
    5: 'Osiągnięcie za osiągnięcie poziomu 5',
    // ... Dodaj więcej osiągnięć do poziomu 999
};

function calculateXpToLevelUp(level) {
    return Math.floor(10 * Math.pow(1.1, level - 1));
}

function getLevelUpMessage(level) {
    const achievement = achievements[level];
    if (achievement) {
        return `Zdobyłeś nowy poziom: ${level}! Osiągnięcie: ${achievement}`;
    } else {
        return `Zdobyłeś nowy poziom: ${level}`;
    }
}

function addAchievement(userId, achievement) {
    db.prepare("INSERT INTO achievements (id, achievement) VALUES (?, ?)").run(userId, achievement);
}

const initDb = () => {
    const tableExistsUsers = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!tableExistsUsers['count(*)']) {
        db.prepare("CREATE TABLE users (id TEXT PRIMARY KEY, xp INTEGER, voiceTime INTEGER, level INTEGER)").run();
    }

    const tableExistsAchievements = db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='achievements'").get();
    if (!tableExistsAchievements['count(*)']) {
        db.prepare("CREATE TABLE achievements (id TEXT, achievement TEXT)").run();
    }
};
initDb();

function handleMessages(message) {
    if (!message.author.bot) {
        const userData = db.prepare("SELECT * FROM users WHERE id = ?").get(message.author.id) || { xp: 0, voiceTime: 0, level: 1 };

        const newUserXP = userData.xp + 1;
        db.prepare("INSERT OR REPLACE INTO users (id, xp, voiceTime, level) VALUES (?, ?, ?, ?)").run(message.author.id, newUserXP, userData.voiceTime, userData.level);

        const xpToLevelUp = calculateXpToLevelUp(userData.level);
        if (newUserXP >= xpToLevelUp && userData.level < 999) {
            const userLevel = userData.level + 1;
            const levelUpMessage = getLevelUpMessage(userLevel);

            // message.author.send(`Gratulacje, ${message.author.username}! ${levelUpMessage}`);
            // message.channel.send(`Gratulacje, ${message.author.username}! ${levelUpMessage}`);

            if (userLevel < 999) {
                db.prepare("INSERT OR REPLACE INTO users (id, xp, voiceTime, level) VALUES (?, ?, ?, ?)").run(message.author.id, newUserXP % xpToLevelUp, userData.voiceTime, userLevel);
            } else {
                db.prepare("UPDATE users SET xp = 0, level = ? WHERE id = ?").run(999, message.author.id);
            }

            addAchievement(message.author.id, levelUpMessage);
        }
    }
}

function handleVoiceState(oldState, newState) {
    const userId = newState.member.user.id;
    const userData = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) || { xp: 0, voiceTime: 0, level: 1 };

    if (newState.channel) {
        userData.voiceStartTime = Date.now();
    } else if (oldState.channel && !newState.channel) {
        const voiceTime = userData.voiceTime + Math.floor((Date.now() - userData.voiceStartTime) / 60000);
        const newUserXP = userData.xp + 2 * voiceTime;

        db.prepare("INSERT OR REPLACE INTO users (id, xp, voiceTime, level) VALUES (?, ?, ?, ?)").run(userId, newUserXP, 0, userData.level);
    }
}

function handleTopCommand(message) {
    const guildMembers = message.guild.members.cache;
    const topUsers = db.prepare("SELECT id, xp, level FROM users ORDER BY xp DESC LIMIT 10").all();

    const embed = new MessageEmbed()
        .setTitle(`10 najaktywniejszych użytkowników na serwerze ${message.guild.name}`)
        .setColor('#0099ff')
        .setTimestamp();

    topUsers.forEach((user, index) => {
        const member = guildMembers.get(user.id) || { user: { tag: '???' } };
        embed.addField(
            `${index + 1}. ${member.user.tag}`,
            `${user.level} (XP: ${user.xp})`,
            true
        );
    });

    const leftMembers = db.prepare("SELECT id FROM users WHERE id NOT IN (?)").pluck().all(guildMembers.keyArray());
    leftMembers.forEach((leftId) => {
        const leftUser = guildMembers.get(leftId);
        if (leftUser) {
            embed.addField(`???. ${leftUser.user.tag}`, 'Osoba, która odeszła z serwera.', true);
        } else {
            embed.addField(`???`, 'Osoba, której nie ma na serwerze.', true);
        }
    });

    message.channel.send({ embeds: [embed] });
}

function handleLevelCommand(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    const userData = db.prepare("SELECT * FROM users WHERE id = ?").get(targetUser.id) || { xp: 0, level: 1 };

    const embed = new MessageEmbed()
        .setTitle(`Poziom użytkownika ${targetUser.tag}`)
        .setColor('#0099ff')
        .setDescription(`Aktualny poziom: ${userData.level}\nXP: ${userData.xp}`)
        .setTimestamp();

    interaction.reply({ embeds: [embed] });
}

module.exports = {
    handleMessages,
    handleVoiceState,
    handleTopCommand,
    handleLevelCommand,
};
