const { SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  getVoiceConnection,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const radioStreams = {
  radiokaszebe: "http://x.radiokaszebe.pl:9000/;?type=http&nocache=87",
  radioniepokalanow: "http://radioniepokalanow.com.pl:7600/rn.mp3",
  radiomaryja: "https://fastcast4u.com/player/radiomaryja/",
  rmf: "https://www.rmfon.pl/play,8#p",
  eska: "http://www.eska.pl/radioonline/play/139",
  zet: "http://www.radiozet.pl/Radio/ZetOnline",
  trojka: "http://n-4-12.dcs.redcdn.pl/sc/o2/Eurozet/live/audio.livx",
  classic: "http://www.rmf.fm/stations/station1.mp3",
  antyradio: "http://ant-waw-01.cdn.eurozet.pl:8602/listen.pls",
  eskatv: "http://www.eskatv.pl/static/stream.pls",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("radio")
    .setDescription("Odtwarzanie radia FM")
    .addSubcommand(subcommand =>
      subcommand
        .setName("play")
        .setDescription("Odpal radio")
        .addStringOption(option =>
          option
            .setName("station")
            .setDescription("Wybierz stację radiową lub podaj link do własnego radia")
            .setRequired(true)
            .addChoices(
              ...Object.keys(radioStreams).map(key => ({
                name: key,
                value: radioStreams[key],
              }))
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("stop")
        .setDescription("Wyłącz radio")
    ),

  async execute(interaction) {
    try {
      const subCommand = interaction.options.getSubcommand();

      switch (subCommand) {
        case "play":
          await playRadio(interaction);
          break;
        case "stop":
          await stopRadio(interaction);
          break;
        default:
          await interaction.reply("Nieznane polecenie!", { ephemeral: true });
          break;
      }
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'radio':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas wykonywania komendy.",
        ephemeral: true,
      });
    }
  },
};

async function playRadio(interaction) {
  try {
    const station = interaction.options.getString("station");

    if (!interaction.member.voice.channelId) {
      return await interaction.reply({
        content: "Musisz być w kanale głosowym, aby użyć tej komendy!",
        ephemeral: true,
      });
    }

    const radioQueue = interaction.client.radio.get(interaction.guild.id) || {
      player: createAudioPlayer(),
      queue: [],
      isPlaying: false,
    };
    interaction.client.radio.set(interaction.guild.id, radioQueue);

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const audioResource = createAudioResource(station, {
      inputType: StreamType.Arbitrary,
    });

    radioQueue.queue.push(audioResource);
    if (!radioQueue.isPlaying) {
      radioQueue.isPlaying = true;
      radioQueue.player.play(radioQueue.queue[0]);
    }

    connection.subscribe(radioQueue.player);

    await interaction.reply(`Odtwarzam ${station}!`);
  } catch (error) {
    console.error("Błąd podczas odtwarzania radia:", error);
    await interaction.reply({
      content: "Wystąpił błąd podczas odtwarzania radia.",
      ephemeral: true,
    });
  }
}

async function stopRadio(interaction) {
  try {
    const radioQueue = interaction.client.radio.get(interaction.guild.id);
    if (!radioQueue || !radioQueue.isPlaying) {
      return await interaction.reply({
        content: "Nie ma aktywnego radia do zatrzymania.",
        ephemeral: true,
      });
    }

    radioQueue.player.stop();
    radioQueue.isPlaying = false;
    radioQueue.queue = [];

    await interaction.reply("Wyłączam radio!");
  } catch (error) {
    console.error("Błąd podczas zatrzymywania radia:", error);
    await interaction.reply({
      content: "Wystąpił błąd podczas zatrzymywania radia.",
      ephemeral: true,
    });
  }
}