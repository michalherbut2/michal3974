const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_wszystkie_ostrzezenia")
    .setDescription("Wyświetl listę ostrzeżeń dla wszystkich użytkowników"),
  async execute(interaction) {
    const db = new betterSqlite3("./warns.db");

    await showAllWarns(interaction, db);

    db.close();
  },
};

async function showAllWarns(interaction, db) {
  const allWarns = await getAllWarns(db);
  let text = `## Wszystkie ostrzeżenia:`;
  let id = 1;
  for (const {userId, warnings} of allWarns) {

    // const clientMember = await interaction.client.users.fetch(userId);
    
    const guildMember = await interaction.guild.members.fetch(userId);
    const nick = guildMember?.displayName;
    // console.log(nick);

    // nick == "babtosz" &&
      // console.log(
      //   guildMember?.user, //działa                                       obiekt    / obiekt
      //   guildMember?.user?.username, // tak username = username = tag     miszalek2 / babtosz.
      //   guildMember?.user?.globalName, //tak c.displayName=g.globalName   Miszalek2 / babtosz
      //   guildMember?.displayName, //działa displayName = nickname         Łuła      / babtosz
      //   guildMember?.nickname //                                          Łuła      / null
      // );
    // nick == "babtosz" &&
    //   console.log(
    //     clientMember?.username, //tak username = tag   miszalek2 / babtosz.
    //     clientMember?.tag, //tak                       miszalek2 / babtosz.
    //     clientMember?.displayName //tak                Miszalek2 / babtosz
    //   );
    text += `\n**${id++}**. ${nick} - \`${warnings}\` ${warnings === 3 ? "**Potem ban**" : ""}`;
  }
  interaction.reply(text);
}

async function getAllWarns(db) {
  return await db.prepare("SELECT * FROM ostrzezenia").all();
}
