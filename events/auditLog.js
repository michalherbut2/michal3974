const { Events } = require("discord.js");
const logPunishments = require("../computings/logPunishments");

module.exports = {
    name: Events.GuildAuditLogEntryCreate,
    once: false,
    async execute(auditLog, guild, client) {
        logPunishments(auditLog, guild, client)
    }
}