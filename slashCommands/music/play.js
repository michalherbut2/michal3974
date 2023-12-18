const { createWarningEmbed } = require("../../computings/createEmbed");
const { SlashCommandBuilder } = require("discord.js");
const getResource = require("../../computings/getResource");
const createVoiceConnection = require("../../computings/createVoiceConnection");
const playMusic = require("../../computings/playMusic");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Gra piosenkę z yt")
    .addStringOption(option =>
      option
        .setName("muzyka")
        .setDescription("nazwa piosenki lub link yt")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const voiceConnection = createVoiceConnection(interaction);
      // const voiceChannel = interaction.member.voice.channel;
      const song = interaction.options.getString("muzyka");
      // const serverId = interaction.guild.id;
      // if (!voiceChannel)
      //   return interaction.reply({
      //     embeds: [createWarningEmbed("dołącz do kanału głosowego!")],
      //     ephemeral: true
      //   });

      const audioResource = await getResource(song);
      // const {title, duration} = audioResource.metadata

      // const voiceConnection = joinVoiceChannel({
      //   channelId: voiceChannel.id,
      //   guildId: serverId,
      //   adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      // });

      // const serverQueue = interaction.client.queue.get(serverId);
      // serverQueue.channel = interaction.channel;
      // serverQueue.queue.push(resource);

      // if (!serverQueue.isPlaying) {
      //   serverQueue.player.play(serverQueue.queue[0]);
      //   serverQueue.isPlaying = true;
      // }

      // voiceConnection.subscribe(serverQueue.player);

      // const content = `gra gitara **${title}** - \`${duration}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;
      // interaction.reply({
      //   embeds: [createSimpleEmbed(content)],
      // });

      playMusic(interaction, audioResource, voiceConnection);
    } catch (error) {
      console.error("Problem:", error);
      interaction.reply({
        embeds: [
          // createWarningEmbed(`Wystąpił błąd podczas odtwarzania muzyki.`),
          createWarningEmbed(error.message),
          
        ],
        ephemeral: true
      });
    }
  },
};
