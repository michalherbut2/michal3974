const { createAudioPlayer } = require("@discordjs/voice");
const getResource = require("../computings/getResource");
const { createSimpleEmbed } = require("../computings/createEmbed");
const { AudioPlayerStatus } = require("@discordjs/voice");

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
  play() {
    this.player.play(this.queue[0]);
    this.isPlaying = true;
  }
}

module.exports=ServerQueue