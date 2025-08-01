const { SlashCommandBuilder, MessageActionRow, MessageButton } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite the bot to your server'),
  async execute(interaction) {
    const bot = interaction.client;
    const embed = bot.say.baseEmbed(interaction)
      .setAuthor({name: `${bot.user.tag}`})
      .setDescription(`Kliknij aby dodać.`)
      .setTimestamp();
    const row = new MessageActionRow().addComponents([
      new MessageButton()
      .setLabel("Invite Link")
      .setStyle("LINK")
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=applications.commands%20bot`)
    ]);

    await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
  }
};
