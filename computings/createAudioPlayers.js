const { AudioPlayerStatus, createAudioResource } = require("@discordjs/voice");
const { createAudioPlayer } = require("@discordjs/voice");
const { createSimpleEmbed } = require("./createEmbed");
const getResource = require("./getResource");

module.exports = async client => {
  class ServerQueue {
    
    constructor() {
      this.channel;
      this.queue = [];
      this.isPlaying = false;
      this.isLooping = false
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
      this.player.on(AudioPlayerStatus.Idle, async () => {
        const title = this.queue.shift()?.metadata?.title;
        this.isLooping && title ?
          this.queue.unshift(await getResource(title))
          :null
        this.queue.length
          ? this.player.play(this.queue[0])
          : (this.isPlaying = false);
        this.channel.send({ 
          embeds: [
            createSimpleEmbed(`🎵 piosenki w kolejce: ${this.queue.length}`),
          ],
        });
      });
      this.player.on("error", error => {
        console.error(`Error: ${error.message} with resource ${error}`);
        this.queue.shift();
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
      this.queue = [
        createAudioResource(
          "http://x.radiokaszebe.pl:9000/;?type=http&nocache=87"
        ),
        createAudioResource("http://radioniepokalanow.com.pl:7600/rn.mp3"),
      ]
      this.isPlaying = false
      this.player = createAudioPlayer()
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
