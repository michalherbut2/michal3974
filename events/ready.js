const checkInactivity = require("../computings/checkInactivity");
const createAudioPlayers = require("../computings/createAudioPlayers");
const createDatabases = require("../computings/createDatabases");
const loadConfig = require("../computings/loadConfig");
const os = require('os');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(
            `${client.user.username} is online on ${client.guilds.cache.size} servers!`
        );

        // Set initial presence
        updatePresence(client);

        // Set interval to update presence every 1 minute
        setInterval(() => {
            updatePresence(client);
        }, 60000); // 1 minute in milliseconds

        createDatabases(client);
        createAudioPlayers(client);
        await loadConfig(client);
    }
}
function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function updatePresence(client) {
    const activities = [
        { name: "Gram w twierdzę!" },
        { name: `Mój ping: ${client.ws.ping}ms` },
        { name: `Jestem na ${client.guilds.cache.size} serwerach!` },
        { name: `Pracuję bez przerwy: ${formatUptime(client.uptime)}` },
        { name: "Jak pogoda?" },
        { name: `Zużycie CPU: ${os.cpus()[0].usage.toFixed(2)}%` },
        { name: `Zużycie RAM: ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}` },
        // Add more activities as needed
    ];


    const randomActivity = activities[Math.floor(Math.random() * activities.length)];

    client.user.setPresence({
        activities: [randomActivity],
    });
}

function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}
