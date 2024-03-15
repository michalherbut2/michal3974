const { createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");
const spotify = require('spotify-url-info');

module.exports = async song => {
  let stream;
  let title;
  let durationRaw;
  let url;

  if (song.includes('spotify.com')) {
    const data = await spotify.getData(song);
    const yt_info = await play.search(data.title, { limit: 1 });
    url = yt_info[0].url;
    title = data.title;
    durationRaw = data.duration;
  } else {
    const yt_info = await play.search(song, { limit: 1 });
    url = yt_info[0].url;
    title = yt_info[0].title;
    durationRaw = yt_info[0].durationRaw;
  }

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
