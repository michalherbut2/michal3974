const { createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

module.exports = async song => {
  let service = '';
  if (song.includes('spotify.com') || song.includes('open.spotify.com')) {
    if (song.includes('/track/')) {
      service = 'spotify_track';
    } else if (song.includes('/album/')) {
      service = 'spotify_album';
    } else if (song.includes('/playlist/')) {
      service = 'spotify_playlist';
    } else if (song.includes('/artist/')) {
      service = 'spotify_artist';
    }
  } else if (song.includes('youtube.com') || song.includes('youtu.be')) {
    if (song.includes('/watch')) {
      service = 'youtube_video';
    } else if (song.includes('/playlist')) {
      service = 'youtube_playlist';
    } else if (song.includes('/channel') || song.includes('/user')) {
      service = 'youtube_channel';
    }
  } else {
    // If the song does not include a URL, assume it's a title
    service = 'title';
  }

  const searchResult = await play.search(song.split('?')[0], {
  limit: 1,
  source: { 
    youtube: service.includes('youtube') ? 'video' : 'video', 
    spotify: service.includes('spotify') ? service.split('_')[1] : (song.includes('playlist') ? 'playlist' : 'track') 
  }
});

  if (!searchResult || searchResult.length === 0) {
    throw new Error('Nie znaleziono utworu.');
  }

  const { url, title, durationRaw } = searchResult[0];

  const streamResult = await play.stream(url, {
    quality: 'highestaudio'
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
