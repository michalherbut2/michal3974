const { createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytsr = require("yt-search");

module.exports = async (song) => {
  try {
    let videoInfo;
    let url;

    // Check if the song is a YouTube URL
    if (ytdl.validateURL(song)) {
      url = song;
      videoInfo = await ytdl.getInfo(url);
    } else {
      // If it is not a URL, search on YouTube
      const searchResults = await ytsr(song);

      if (!searchResults || !searchResults.videos || !searchResults.videos.length) {
        throw new Error("Nie znaleziono filmu!");
      }

      url = searchResults.videos[0].url;
      videoInfo = await ytdl.getInfo(url);
    }

    if (!url) throw new Error("Nie znaleziono linka!");

    const title = videoInfo.videoDetails.title;
    const durationRaw = formatDuration(videoInfo.videoDetails.lengthSeconds);

    const stream = ytdl(url, { filter: "audioonly" });

    const resource = createAudioResource(stream);
    resource.metadata = {
      title,
      duration: durationRaw,
      stream,
    };

    return resource;
  } catch (error) {
    console.error("Error processing song:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const formatDuration = (seconds) => {
  const date = new Date(seconds * 1000).toISOString().substr(11, 8);
  return date.startsWith("00:") ? date.substr(3) : date;
};