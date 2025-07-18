const { AuditLogEvent, Events } = require("discord.js");
const logTimeout = require("../functions/messages/logTimeout");
const logBan = require("../functions/messages/logBan");
const logKick = require("../functions/messages/logKick");

module.exports = {
  name: Events.GuildAuditLogEntryCreate,
  once: false,
  async execute(auditLog, guild, client) {

    switch (auditLog.action) {
      case AuditLogEvent.MemberBanAdd:
        logBan(auditLog, guild);
        break;

      case AuditLogEvent.MemberUpdate:
        logTimeout(auditLog, guild, client);
        break;
      case AuditLogEvent.MemberKick:
        logKick(auditLog, guild, client);
        break;

      default:
        break;
    }
  },
};
