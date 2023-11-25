const radioStreams = {
  // radiokaszebe: "http://x.radiokaszebe.pl:9000/;?type=http&nocache=87",
  // radioniepokalanow: "http://radioniepokalanow.com.pl:7600/rn.mp3",
  // radiokaszebe: '0',
  // radioniepokalanow: '1',
  // radiomaryja: "https://fastcast4u.com/player/radiomaryja/",
  // rmf: "https://www.rmfon.pl/play,8#p",
  // eska: "http://www.eska.pl/radioonline/play/139",
  // zet: "http://www.radiozet.pl/Radio/ZetOnline",
  // trojka: "http://n-4-12.dcs.redcdn.pl/sc/o2/Eurozet/live/audio.livx",
  // classic: "http://www.rmf.fm/stations/station1.mp3",
  // antyradio: "http://ant-waw-01.cdn.eurozet.pl:8602/listen.pls",
  // eskatv: "http://www.eskatv.pl/static/stream.pls",
};
const { SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
} = require("@discordjs/voice");
const { StreamType } = require("@discordjs/voice");
const { AudioPlayerStatus } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");

// const radioList = option =>
//   option
//     .setName("station")
//     .setDescription("Wybierz stację radiową lub podaj link do własnego radia")
//     .setRequired(true)
//     .addChoices(
//       ...Object.keys(radioStreams).map(key => ({
//         name: key,
//         value: radioStreams[key],
//       }))
//     );

module.exports = {
  data: new SlashCommandBuilder()
    .setName("radio")
    .setDescription("Odtwarzanie radia FM")
    .addSubcommand(subcommand =>
      subcommand
        .setName("play")
        .setDescription("Odpal radio")
        // .addStringOption(radioList)
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("stop")
        .setDescription("Wyłącz radio")
    ),
  async execute(interaction) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "play":
        await playRadio(interaction);
        break;
      case "stop":
        await stopRadio(interaction);
        break;
      default:
        interaction.reply("Nieznane polecenie!");
        break;
    }
    
  },
};
async function playRadio(interaction) {
  // const station = interaction.options.getString("station");

  const radioQueue = await interaction.client.radio.get(interaction.guild.id);
  const connection = joinVoiceChannel({
    channelId: interaction.member.voice.channelId,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });
  
  // const audioResource = createAudioResource(station);

  if (!radioQueue.isPlaying) {
    radioQueue.isPlaying = true;
    radioQueue.player.play(radioQueue.queue[0]);
  }
  radioQueue.player.unpause();
  connection.subscribe(radioQueue.player);

  // console.log(+station);
  // radioQueue.queue.push(audioResource);

  interaction.reply(`Odtwarzam Radio Kaszëbë!`);
}
 
async function stopRadio(interaction)  {
  const radioQueue = await interaction.client.radio.get(interaction.guild.id);
  if (radioQueue.isPlaying)
    radioQueue.player.pause()
    // radioQueue.player.stop()
  interaction.reply(`Wyłączam radio!`);
}