const { AudioPlayerStatus, createAudioPlayer } = require("@discordjs/voice");
const getResource = require("../functions/music/getResource");
const sendEmbed = require("../functions/messages/sendEmbed");

class ServerQueue {
  constructor() {
    this.channel = null;
    this.queue = [];
    this.isPlaying = false;
    this.isLooping = false;
    this.player = createAudioPlayer();

    this.player.on(AudioPlayerStatus.Playing, () => {
      console.log("The music player has started playing!");
    });

    this.player.on(AudioPlayerStatus.AutoPaused, () => {
      console.log("Music paused!");
    });

    this.player.on(AudioPlayerStatus.Buffering, () => {
      console.log("Buffering music!");
    });

    this.player.on(AudioPlayerStatus.Idle, async () => {
      try {
        // Get the URL of the next song in the queue
        const url = this.queue.shift()?.metadata?.url;

        // Loop the URL if looping is enabled
        if (this.isLooping && url) {
          const resource = await getResource(url);
          this.queue.unshift(resource);
        }

        // Play the next song from the queue or stop playing
        if (this.queue.length) {
          this.player.play(this.queue[0]);
        } else {
          this.isPlaying = false;
        }

        // Send an embed message indicating the number of songs in the queue
        sendEmbed(this.channel, {
          description: `🎵 Songs in queue: ${this.queue.length}`,
        });

      } catch (error) {
        console.error(`Error handling Idle state: ${error.message}`);
      }
    });

    this.player.on("error", error => {
      console.error(`Error: ${error.message} with resource ${error.resource}`);
      this.queue.shift();
    });
  }

  async play() {
    try {
      if (this.queue.length === 0) {
        console.log("Queue is empty, nothing to play.");
        return;
      }

      console.log("Playing:", this.queue[0]);
      this.player.play(this.queue[0]);
      this.isPlaying = true;
      console.log("Playing music.");

    } catch (error) {
      console.error(`Error during play: ${error.message}`);
    }
  }

  async addToQueue(url) {
    try {
      const resource = await getResource(url);
      this.queue.push(resource);
      console.log(`Added to queue: ${url}`);

      if (!this.isPlaying) {
        this.play();
      }

    } catch (error) {
      console.error(`Error adding to queue: ${error.message}`);
    }
  }

  setChannel(channel) {
    this.channel = channel;
  }
}

module.exports = ServerQueue;