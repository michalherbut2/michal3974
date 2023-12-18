const { AudioPlayerStatus, createAudioResource, createAudioPlayer } = require("@discordjs/voice");

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
module.exports=RadioQueue