const { AudioPlayerStatus, createAudioPlayer } = require("@discordjs/voice");
const getResource = require("../functions/music/getResource");
const sendEmbed = require("../functions/messages/sendEmbed");

class ServerQueue {
  constructor() {
    this.channel;
    this.queue = [];
    this.isPlaying = false;
    this.isLooping = false;
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
      // get the url
      const url = this.queue.shift()?.metadata?.url;

      // loop the url
      this.isLooping && url && this.queue.unshift(await getResource(url));
      
      this.queue.length
        // play the next song from the queue
        ? this.player.play(this.queue[0])
        // stop playing
        : (this.isPlaying = false);

      sendEmbed(this.channel, {
        description: `🎵 piosenki w kolejce: ${this.queue.length}`,
      });
    });

    this.player.on("error", error => {
      console.error(`Error: ${error.message} with resource ${error}`);
      this.queue.shift();
    });
  }

  play() {
    console.log("musica:",this.queue[0]);
    this.player.play(this.queue[0]);
    this.isPlaying = true;
    console.log("gram");
  }
}

module.exports = ServerQueue;
