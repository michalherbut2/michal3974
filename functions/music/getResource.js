const { createAudioResource } = require("@discordjs/voice");
const { Attachment } = require("discord.js");
const { Manager } = require("erela.js");

// Assume you have a Lavalink manager instance set up
const manager = new Manager({
  nodes: [
    {
      host: "lavalinkv3-id.serenetia.com",
      port: 443,
      password: "BatuManaBisa",
      secure: true,
    },
  ],
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

module.exports = async (song) => {
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
    let result;
    if (isURL(song)) {
      result = await manager.search(song);
    } else {
      result = await manager.search(song, "youtube");
    }

    if (result.loadType === "PLAYLIST_LOADED") {
      result.tracks.forEach((track) => {
        streams.push({
          stream: track.uri,
          metadata: {
            title: track.title,
            duration: formatDuration2(track.duration / 1000),
            url: track.uri,
          },
        });
      });
    } else if (result.loadType === "TRACK_LOADED" || result.loadType === "SEARCH_RESULT") {
      const track = result.tracks[0];
      streams.push({
        stream: track.uri,
        metadata: {
          title: track.title,
          duration: formatDuration2(track.duration / 1000),
          url: track.uri,
        },
      });
    } else {
      throw new Error("No tracks found!");
    }
  }

  return streams.map((s) => {
    const resource = createAudioResource(s.stream);
    resource.metadata = s.metadata;
    return resource;
  });
};

const formatDuration2 = async (seconds) =>
  new Date(seconds * 1000).toISOString().slice(11, 19);

async function getDuration(url) {
  const result = await manager.search(url);
  if (result.tracks.length > 0) {
    return formatDuration2(result.tracks[0].duration / 1000);
  }
  return null;
}

function isURL(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
