const { createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytsr = require("yt-search");
const { Attachment } = require("discord.js");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const YouTube = require("youtube-sr").default;

module.exports = async (song) => {
  try {
    const streams = [];

    if (song instanceof Attachment) {
      streams.push({
        stream: song.url,
        metadata: {
          title: song.name,
          duration: await getDuration(song.url),
          url: song.url,
        },
      });
    } else {
      // Check if song is a YouTube URL
      if (ytdl.validateURL(song)) {
        try {
          const searchResults = await YouTube.getPlaylist(song);
          searchResults.videos.forEach((video) => {
            streams.push({
              stream: `https://www.youtube.com/watch?v=${video.id}`,
              metadata: {
                title: video.title,
                duration: video.durationFormatted,
                url: `https://www.youtube.com/watch?v=${video.id}`,
              },
            });
          });

          if (streams.length === 0) throw new Error("Playlist is empty!");
        } catch (error) {
          // Regular video URL
          streams.push({
            stream: song,
            metadata: {
              title: await getTitle(song),
              duration: await getDuration(song),
              url: song,
            },
          });
        }
      } else {
        // If not a URL, search on YouTube
        const searchResults = await ytsr(song);

        if (!searchResults.videos.length) throw new Error("No video found!");

        streams.push({
          metadata: {
            url: searchResults.videos[0].url,
          },
        });
      }

      await Promise.all(
        streams.map(async (s) => {
          const videoInfo = await ytdl.getInfo(s.metadata.url);
          s.stream = ytdl(s.metadata.url, { filter: "audioonly" });
          s.metadata.title = videoInfo.videoDetails.title;
          s.metadata.duration = await formatDuration2(
            videoInfo.videoDetails.lengthSeconds
          );
        })
      );
    }

    return streams.map((s) => {
      const resource = createAudioResource(s.stream);
      resource.metadata = s.metadata;
      return resource;
    });
  } catch (error) {
    console.error("Error processing song:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const formatDuration2 = (seconds) =>
  new Date(seconds * 1000).toISOString().slice(11, 19);

async function getDuration(url) {
  const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${url}"`;
  try {
    const { stdout } = await execPromise(cmd);
    return formatDuration2(parseFloat(stdout));
  } catch (error) {
    console.error("Error getting duration:", error);
    return null;
  }
}

async function getTitle(url) {
  try {
    const info = await ytdl.getInfo(url);
    return info.videoDetails.title;
  } catch (error) {
    console.error("Error getting title:", error);
    return "Unknown Title";
  }
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}