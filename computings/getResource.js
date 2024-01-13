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
  } else if (song.includes('soundcloud.com')) {
    service = 'soundcloud';
  } else {
    // If the song does not include a URL, assume it's a title
    service = 'title';
  }

  try {
    const searchResult = await play.search(song.split('?')[0], {
      limit: 1,
      source: {
        youtube: service.includes('youtube') ? 'video' : 'auto',
        spotify: service.includes('spotify') ? service.split('_')[1] : 'auto',
        soundcloud: service.includes('soundcloud') ? 'track' : 'auto',
      },
    });

    if (!searchResult || searchResult.length === 0) {
      throw new Error('Nie znaleziono utworu.');
    }

    let tracks = [];

    if (service === 'spotify_playlist') {
      // Handle Spotify playlist case
      const playlistTracks = await play.playlistInfo(searchResult[0].id, { limit: 100 }); // Change limit as needed

      if (!playlistTracks || playlistTracks.length === 0) {
        throw new Error('Brak informacji o utworach w playliście.');
      }

      tracks = playlistTracks.map((track) => ({
        url: track.url,
        title: track.name,
        durationRaw: track.duration,
      }));
    } else {
      // Handle other cases
      if (!searchResult[0]?.yt_info) {
        throw new Error('Brak informacji (yt_info) w wynikach wyszukiwania.');
      }

      const { url, title, durationRaw } = searchResult[0].yt_info;
      tracks.push({ url, title, durationRaw });
    }

    if (tracks.length === 0) {
      throw new Error('Brak utworów do odtworzenia.');
    }

    const resources = tracks.map((track) => {
      const streamResult = play.stream(track.url, {
        quality: 'highestaudio',
      });

      if (!streamResult || !streamResult.stream) {
        throw new Error(`Nie można odtworzyć utworu: ${track.title}`);
      }

      const resource = createAudioResource(streamResult.stream);
      resource.metadata = {
        title: track.title,
        duration: track.durationRaw,
        stream: streamResult.stream,
      };

      return resource;
    });

    return resources;
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
};
