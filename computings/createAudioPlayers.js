const { AudioPlayerStatus, createAudioResource } = require("@discordjs/voice");
const { createAudioPlayer } = require("@discordjs/voice");

module.exports = async client => {
  
  const serverQueue = {
    queue: [],
    isPlaying: false,
    player: createAudioPlayer(),
  };

  const radioQueue = {
    queue: [createAudioResource("http://x.radiokaszebe.pl:9000/;?type=http&nocache=87"),createAudioResource("http://radioniepokalanow.com.pl:7600/rn.mp3")],
    isPlaying: false,
    player: createAudioPlayer(),
  };

  serverQueue.player.on(AudioPlayerStatus.Playing, () => {
    console.log("The music player has started playing!");
  });
  serverQueue.player.on(AudioPlayerStatus.AutoPaused, () => {
    console.log("muzyka zapałzowany!");
  });
  serverQueue.player.on(AudioPlayerStatus.Buffering, () => {
    console.log("bufersuje muzyke!");
  });

  radioQueue.player.on(AudioPlayerStatus.Playing, () => {
    console.log("The radio player has started playing!");
  });
  radioQueue.player.on(AudioPlayerStatus.AutoPaused, () => {
    console.log("radio zapałzowany!");
  });
  radioQueue.player.on(AudioPlayerStatus.Buffering, () => {
    console.log("bufersuje radio!");
  });

  client.guilds.cache.forEach(guild => client.queue.set(guild.id, serverQueue));
  client.guilds.cache.forEach(guild => client.radio.set(guild.id, radioQueue));
};
