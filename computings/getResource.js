const { createAudioResource, createAudioPlayer, joinVoiceChannel, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');
const play = require('play-dl');

// Get a free SoundCloud Client ID and set it
play.getFreeClientID().then((clientID) => {
    play.setToken({
      soundcloud : {
          client_id : clientID
      }
    });
});

// Set your Spotify tokens
play.setToken({
  spotify: {
    client_id: 'b66270629d3b48508cf60ec8d7c8240e',
    client_secret: 'bbab9a16a2e44b0a93ef2f0c2c0f2745'
  }
});

module.exports = async song => {
  let stream;
  let url;
  let title;
  let durationRaw;

  // Try to get info from YouTube first
  const yt_info = await play.search(song, {
    limit: 1,
    type: 'video' // This ensures that only videos are returned in the search
  });

  if (yt_info.length > 0) {
    url = yt_info[0].url;
    title = yt_info[0].title;
    durationRaw = yt_info[0].durationRaw;
    stream = await play.stream(url);
  } else {
    // If no results from YouTube, try Spotify
    const sp_info = await play.spotify(song);

    if (sp_info) {
      url = sp_info.url;
      title = sp_info.title;
      durationRaw = sp_info.durationRaw;
      stream = await play.stream(url);
    } else {
      // If no results from Spotify, try SoundCloud
      const sc_info = await play.soundcloud(song);

      if (sc_info) {
        url = sc_info.url;
        title = sc_info.title;
        durationRaw = sc_info.durationRaw;
        stream = await play.stream(url);
      } else {
        throw new Error('No results found on YouTube, Spotify or SoundCloud.');
      }
    }
  }

  // Create the encoder.
  // Specify 48kHz sampling rate and 2 channel size.
  const encoder = new OpusEncoder(48000, 2);

  // Encode and decode.
  const encoded = encoder.encode(stream);
  const decoded = encoder.decode(encoded);

  const resource = createAudioResource(decoded, { inputType: StreamType.Opus });
  resource.metadata = {
    title,
    duration: durationRaw,
    stream: decoded
  };

  return resource;
};
