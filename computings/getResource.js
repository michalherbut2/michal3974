const { createAudioResource, createAudioPlayer, joinVoiceChannel, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');
const play = require('play-dl');
const ytdl = require('ytdl-core-discord');

module.exports = async song => {
  const yt_info = await play.search(song, {
    limit: 1,
  });

  const { url, title, durationRaw } = yt_info[0];

  const stream = await ytdl(url);

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
}
