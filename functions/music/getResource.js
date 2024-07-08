const { createAudioResource } = require("@discordjs/voice");
// const ytdl = require("@distube/ytdl-core");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = async song => {
  let videoInfo;
  let url;

  // Check if song is a YouTube URL
  if (ytdl.validateURL(song)) {
    url = song;
    videoInfo = await ytdl.getInfo(url);
  } else {
    // If not a URL, search on YouTube
    const searchResults = await ytSearch(song);
    if (!searchResults.videos.length) throw new Error("No video found!");

    url = searchResults.videos[0].url;
    videoInfo = await ytdl.getInfo(url);
  }

  if (!url) throw new Error("No URL found!");

  const title = videoInfo.videoDetails.title;
  const duration = new Date(videoInfo.videoDetails.lengthSeconds * 1000)
    .toISOString()
    .slice(11, 19);

  const stream = ytdl(url, { filter: "audioonly" });

  const resource = createAudioResource(stream);
  resource.metadata = {
    title,
    duration,
    stream,
  };

  return resource;
};
