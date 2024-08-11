const { createAudioResource } = require("@discordjs/voice");
// const ytdl = require("@distube/ytdl-core");
const ytdl = require("ytdl-core");

const ytsr = require("yt-search");
const { Attachment } = require("discord.js");

const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec); 

const YouTube = require("youtube-sr").default;

module.exports = async song => {
  // let videoInfo, url, title, duration, stream;
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
      // const searchResults = await ytsr( { listId: 'K_yBUfMGvzc&list=RDK_yBUfMGvzc&index=1&ab_channel=PRMDMusic' } )
      try {
        const searchResults = await YouTube.getPlaylist(song);

        // console.log(searchResults);
        urls = searchResults.videos.map(v =>
          streams.push({
            stream: `https://www.youtube.com/watch?v=${v.id}`,
            metadata: {
              title: v.title,
              duration: v.durationFormatted,
              url: `https://www.youtube.com/watch?v=${v.id}`,
            },
          })
        );
        // console.log("xd", urls);
        if (!urls.length) throw new Error("Playlist is empty!");
      } catch (error) {
        // Regular video URL
        // url = song;
        streams.push({
          stream: song,
          metadata: {
            title: song.name,
            duration: await getDuration(song.url),
            url: song.url,
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

    // if (!url) throw new Error("No URL found!");

    await Promise.all(
      streams.map(async s => {
        const videoInfo = await ytdl.getInfo(s.metadata.url);
        s.stream = ytdl(s.metadata.url, { filter: "audioonly" });
        s.metadata.title = videoInfo.videoDetails.title;
        s.metadata.duration = await formatDuration2(
          videoInfo.videoDetails.lengthSeconds
        );
      })
    );
    // streams[0] = {
    //   stream: ytdl(url, { filter: "audioonly" }),
    //   metadata: {
    //     title: videoInfo.videoDetails.title,
    //     duration: await formatDuration2(videoInfo.videoDetails.lengthSeconds),
    //   },
    // };

    // title = videoInfo.videoDetails.title;
    // duration = await formatDuration2(videoInfo.videoDetails.lengthSeconds);
    // stream = ytdl(url, { filter: "audioonly" });
  }

  return streams.map(s => {
    // console.log(s);
    const resource = createAudioResource(s.stream);
    resource.metadata = s.metadata;
    return resource;
  });
};

const formatDuration2 = async seconds =>
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

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
