const { joinVoiceChannel } = require("@discordjs/voice");
const {
  createSimpleEmbed,
  createWarningEmbed,
} = require("../../computings/createEmbed");

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const getResource = require("../../computings/getResource");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play_duzo")
    .setDescription("Gra piosenkę z yt")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)

    .addStringOption(option =>
      option
        .setName("muzyka")
        .setDescription("nazwa piosenki lub link yt")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("ile")
        .setDescription("ile razy zagrać")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const voiceChannel = interaction.member.voice.channel;
      const song = interaction.options.getString("muzyka");
      const num = interaction.options.getInteger("ile");
      const serverId = interaction.guild.id;
      if (!voiceChannel)
        return interaction.reply({
          embeds: [createWarningEmbed("dołącz do kanału głosowego!")],
          ephemeral: true,
        });

      const resource = await getResource(song);
      const { title, duration } = resource.metadata;
      // const t = []
      // for (let i = 0; i < num; i++)
      //   t.push(resource)
      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: serverId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const serverQueue = interaction.client.queue.get(serverId);
      serverQueue.channel = interaction.channel;
      serverQueue.queue.push(resource);
      setTimeout(async () => {
        for (let i = 0; i < num-1; i++)
          serverQueue.queue.push(await getResource(song))
      },0)

      if (!serverQueue.isPlaying) {
        serverQueue.player.play(serverQueue.queue[0]);
        serverQueue.isPlaying = true;
      }

      voiceConnection.subscribe(serverQueue.player);

      const content = `gra gitara **${title}** - \`${duration}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;
      interaction.reply({
        embeds: [createSimpleEmbed(content)],
      });
    } catch (error) {
      console.error("Problem:", error);
      interaction.reply({
        embeds: [
          createWarningEmbed(`Wystąpił błąd podczas odtwarzania muzyki.`),
        ],
      });
    }
  },
};
