const { AuditLogEvent, Events } = require("discord.js");
const logTimeout = require("../functions/messages/logTimeout");
const logBan = require("../functions/messages/logBan");

module.exports = {
  name: Events.GuildAuditLogEntryCreate,
  once: false,
  async execute(auditLog, guild, client) {
    try {
      // Ensure auditLog and action are defined
      if (!auditLog || !auditLog.action) {
        throw new Error("Invalid audit log entry");
      }

      // Handle different audit log events
      switch (auditLog.action) {
        case AuditLogEvent.MemberBanAdd:
          try {
            await logBan(auditLog, guild);
          } catch (error) {
            console.error("Error logging ban:", error);
          }
          break;

        case AuditLogEvent.MemberUpdate:
          try {
            await logTimeout(auditLog, guild, client);
          } catch (error) {
            console.error("Error logging timeout:", error);
          }
          break;

        default:
          console.log(`Unhandled audit log action: ${auditLog.action}`);
          break;
      }
    } catch (error) {
      console.error("Error processing audit log entry:", error);
    }
  },
};