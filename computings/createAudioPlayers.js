const { AudioPlayerStatus, createAudioResource } = require("@discordjs/voice");
const { createAudioPlayer } = require("@discordjs/voice");

module.exports = async client => {
  class ServerQueue {
    constructor() {
      this.queue = [];
      this.isPlaying = false;
      this.player = createAudioPlayer();
      this.player.on(AudioPlayerStatus.Playing, () => {
        console.log("The music player has started playing!");
      });
      this.player.on(AudioPlayerStatus.AutoPaused, () => {
        console.log("muzyka zapałzowany!");
      });
      this.player.on(AudioPlayerStatus.Buffering, () => {
        console.log("bufersuje muzyke!");
      });
    }
  }
  const serverQueue = {
    queue: [],
    isPlaying: false,
    player: createAudioPlayer(),
  };

  const radioQueue = {
    queue: [
      createAudioResource(
        "http://x.radiokaszebe.pl:9000/;?type=http&nocache=87"
      ),
      createAudioResource("http://radioniepokalanow.com.pl:7600/rn.mp3"),
    ],
    isPlaying: false,
    player: createAudioPlayer(),
  };

  class RadioQueue {
    constructor() {
      queue = [
        createAudioResource(
          "http://x.radiokaszebe.pl:9000/;?type=http&nocache=87"
        ),
        createAudioResource("http://radioniepokalanow.com.pl:7600/rn.mp3"),
      ]
      isPlaying = false
      player = createAudioPlayer()
      this.player.on(AudioPlayerStatus.Playing, () => {
        console.log("The radio player has started playing!");
      });
      this.player.on(AudioPlayerStatus.AutoPaused, () => {
        console.log("radio zapałzowany!");
      });
      this.player.on(AudioPlayerStatus.Buffering, () => {
        console.log("bufersuje radio!");
      });
    }
  };

  

  client.guilds.cache.forEach(guild =>
    client.queue.set(guild.id, new ServerQueue())
  );
  client.guilds.cache.forEach(guild => client.radio.set(guild.id, new RadioQueue()));
};
