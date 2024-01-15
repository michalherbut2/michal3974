const { createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

module.exports = async song => {
  const yt_info = await play.search(song, {
    limit: 1,
  });
  
  const { url, title, durationRaw } = yt_info[0];
  
  const { stream } = await play.stream(url, {
    discordPlayerCompatibility: true,
  });
  
  const resource = createAudioResource(stream);
  resource.metadata = {
    title,
    duration: durationRaw,
    stream 
  };
  return resource
}