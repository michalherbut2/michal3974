const { joinVoiceChannel, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");
const {
  createSimpleEmbed,
  createWarningEmbed,
} = require("../../computings/createEmbed");


const { SlashCommandBuilder } = require("discord.js");

module.exports = { 
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Odpowiada Pong!")
    .addStringOption(option =>
      option
        .setName("muzyka")
        .setDescription("nazwa piosenki lub link yt 1100 11 00")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const voiceChannel = interaction.member.voice.channel;
      const song = interaction.options.getString("muzyka")
      const serverId = interaction.guild.id;
      if (!voiceChannel)
        return interaction.reply({
          embeds: [createWarningEmbed("dołącz do kanału głosowego!")],
          ephemeral: true
        });

      const yt_info = await play.search(song, {
        limit: 1,
      });

      const { url, title, durationRaw } = yt_info[0];

      const { stream } = await play.stream(url, {
        discordPlayerCompatibility: true,
      });

      const resource = createAudioResource(stream);
      resource.metadata = {
        title,
        duration: durationRaw,
      };

      const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: serverId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const serverQueue = interaction.client.queue.get(serverId);
      serverQueue.channel = interaction.channel;
      serverQueue.queue.push(resource);

      if (!serverQueue.isPlaying) {
        serverQueue.player.play(serverQueue.queue[0]);
        serverQueue.isPlaying = true;
      }

      voiceConnection.subscribe(serverQueue.player);

      const content = `gra gitara **${title}** - \`${durationRaw}\`\n🎵 piosenki w kolejce: ${serverQueue.queue.length}`;
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