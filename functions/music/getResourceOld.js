// const { createAudioResource } = require("@discordjs/voice");
// const play = require("play-dl");

// module.exports = async song => {
//   const yt_info = await play.search(song, {
//     limit: 1,
//   });
  
//   const { url, title, durationRaw } = yt_info[0];
  
//   if (!url) throw new Error("Nie znaleziono linka!")

//   const { stream } = await play.stream(url, {
//     discordPlayerCompatibility: true,
//   });
  
//   const resource = createAudioResource(stream);
//   resource.metadata = {
//     title,
//     duration: durationRaw,
//     stream 
//   };
//   return resource
// }

const { createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytsr = require("yt-search");

module.exports = async (song) => {
  let videoInfo;
  let url;

  // Sprawdź, czy song jest linkiem YouTube
  if (ytdl.validateURL(song)) {
    url = song;
    videoInfo = await ytdl.getInfo(url);
  } else {
    // Jeśli nie jest linkiem, wyszukaj na YouTube
    const searchResults = await ytsr(song);
    // if (searchResults.items.length === 0) {
    //   throw new Error("Nie znaleziono filmu!");
    // }
    // url = searchResults.items[0].url;
    url = searchResults.videos[0].url;
    videoInfo = await ytdl.getInfo(url);
  }

  if (!url) throw new Error("Nie znaleziono linka!");

  const title = videoInfo.videoDetails.title;
  const durationRaw = new Date(videoInfo.videoDetails.lengthSeconds * 1000)
    .toISOString()
    .substr(11, 8);

  const stream = ytdl(url, { filter: "audioonly" });

  const resource = createAudioResource(stream);
  resource.metadata = {
    title,
    duration: durationRaw,
    stream,
  };

  return resource;
};