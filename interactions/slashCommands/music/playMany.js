const { joinVoiceChannel } = require("@discordjs/voice");
const sendEmbed = require("../../../functions/messages/sendEmbed");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const getResource = require("../../../functions/music/getResource");

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
      option.setName("ile").setDescription("ile razy zagrać").setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return await interaction.editReply({
          content: "Musisz być w kanale głosowym, aby użyć tej komendy!",
          ephemeral: true,
        });
      }

      const song = interaction.options.getString("muzyka");
      const num = interaction.options.getInteger("ile");
      const serverId = interaction.guild.id;

      const resource = await getResource(song);
      const { title, duration } = resource.metadata;

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: serverId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const serverQueue = interaction.client.queue.get(serverId) || {
        queue: [],
        isPlaying: false,
        player: voiceConnection.state.subscription.player,
        channel: interaction.channel,
      };

      // Add the first resource
      serverQueue.queue.push(resource);

      // Add the remaining resources
      setTimeout(async () => {
        for (let i = 0; i < num - 1; i++) {
          serverQueue.queue.push(await getResource(song));
        }
      }, 0);

      if (!serverQueue.isPlaying) {
        serverQueue.player.play(serverQueue.queue[0]);
        serverQueue.isPlaying = true;
      }

      voiceConnection.subscribe(serverQueue.player);

      const description = `Odtwarzam teraz **${title}** - \`${duration}\`\n🎵 Piosenki w kolejce: ${serverQueue.queue.length}`;
      await sendEmbed(interaction, { description });

      // Save the serverQueue back to the client
      interaction.client.queue.set(serverId, serverQueue);
    } catch (error) {
      console.error("Problem:", error);
      await sendEmbed(interaction, {
        description: `Wystąpił błąd: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};