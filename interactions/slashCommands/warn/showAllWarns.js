const { SlashCommandBuilder } = require("discord.js");
const betterSqlite3 = require("better-sqlite3");
const {
  createWarningEmbed,
  createEmbed,
} = require("../../../functions/messages/createEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poka_wszystkie_ostrzezenia")
    .setDescription("Wyświetl listę ostrzeżeń dla wszystkich użytkowników"),
  async execute(interaction) {
    const db = new betterSqlite3(`db/db_${interaction.guild.id}.db`);

    await showAllWarns(interaction, db);

    db.close();
  },
};

async function showAllWarns(interaction, db) {
  const allWarns = await getAllWarns(db);
  let text = ``;
  let id = 1;
  if (allWarns.length === 0)
    return interaction.reply({
      embeds: [createWarningEmbed("Brak danych o ostrzeżeniach w bazie.")],
    });

  for (const { user_id: userId, warn_num: warnNum, reason } of allWarns) {
    // const clientMember = await interaction.client.users.fetch(userId);

    // const guildMember = await interaction.guild.members.fetch(userId);

    // const interactionMember = interaction.member?.nickname || interaction.user.globalName;

    // const nick = guildMember?.displayName;

    // // // // const nick = await getNick(interaction, userId);

    // console.log(nick);
    // console.log(interactionMember);
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
    text += `\n**${id++}**. <@${userId}> - \`${warnNum}\` za: **${reason}** ${
      warnNum === 3 ? "**Potem ban**" : ""
    }`;
  }
  interaction.reply({ embeds: [createEmbed("Wszystkie ostrzeżenia:", text)] });
}

async function getAllWarns(db) {
  return await db.prepare("SELECT * FROM warn").all();
}
