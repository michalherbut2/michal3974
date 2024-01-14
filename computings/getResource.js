const { createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

module.exports = async song => {
  let service = '';
  if (song.includes('spotify.com')) {
    service = 'spotify';
  } else if (song.includes('youtube.com')) {
    service = 'youtube';
  } else {
    service = 'title';
  }

  const searchResult = await play.search(song.split('?')[0], {
    limit: 1,
    source: { 
      youtube: 'video', 
      spotify: song.includes('playlist') ? 'playlist' : 'track'
    }
  });

  if (!searchResult || searchResult.length === 0) {
    throw new Error('Nie znaleziono utworu.');
  }

  const { url, title, durationRaw } = searchResult[0];

  const streamResult = await play.stream(url, {
    quality: 320
  });

  if (!streamResult) {
    throw new Error('Nie można odtworzyć utworu.');
  }

  const resource = createAudioResource(streamResult.stream);
  resource.metadata = {
    title,
    duration: durationRaw,
    stream: streamResult.stream
  };
  return resource;
}
