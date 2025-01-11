const { AudioPlayerStatus, createAudioResource, createAudioPlayer } = require("@discordjs/voice");

class RadioQueue {
  constructor() {
    this.queue = [
      this.createSafeAudioResource("http://x.radiokaszebe.pl:9000/;?type=http&nocache=87"),
      this.createSafeAudioResource("http://radioniepokalanow.com.pl:7600/rn.mp3"),
    ];
    this.isPlaying = false;
    this.player = createAudioPlayer();

    this.player.on(AudioPlayerStatus.Playing, () => {
      console.log("The radio player has started playing!");
    });

    this.player.on(AudioPlayerStatus.AutoPaused, () => {
      console.log("Radio paused!");
    });

    this.player.on(AudioPlayerStatus.Buffering, () => {
      console.log("Buffering radio!");
    });

    this.player.on('error', error => {
      console.error(`Error in radio player: ${error.message}`);
    });
  }

  createSafeAudioResource(url) {
    try {
      return createAudioResource(url);
    } catch (error) {
      console.error(`Failed to create audio resource from URL ${url}:`, error);
      return null;
    }
  }

  playNext() {
    if (this.queue.length === 0) {
      console.log("No more items in the queue.");
      this.isPlaying = false;
      return;
    }

    const resource = this.queue.shift();
    if (resource) {
      this.player.play(resource);
      this.isPlaying = true;
    } else {
      console.log("Failed to play the next item in the queue.");
    }
  }

  addResource(url) {
    const resource = this.createSafeAudioResource(url);
    if (resource) {
      this.queue.push(resource);
      console.log(`Added new resource to queue: ${url}`);
    } else {
      console.log(`Failed to add new resource to queue: ${url}`);
    }
  }
}

module.exports = RadioQueue;