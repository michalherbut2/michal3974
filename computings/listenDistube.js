module.exports = distube => {
  distube
    .on("playSong", (queue, song) =>
      queue.textChannel?.send(
        `Gra gitara 🎵 \`${song.name}\` - \`${song.formattedDuration}\``
      )
    )
    .on("addSong", (queue, song) =>
      queue.textChannel?.send(
        `Dodano ${song.name} - \`${song.formattedDuration}\``
      )
    )
    .on("addList", (queue, playlist) =>
      queue.textChannel?.send(
        `Dodano \`${playlist.name}\` playlistę (${playlist.songs.length} songs) do kolejki`
      )
    )
    .on("error", (textChannel, e) => {
      console.error(e);
      textChannel.send(`Problem: ${e.message.slice(0, 2000)}`);
    })
    .on("finish", queue => queue.textChannel?.send("Finito!"))
    // .on("finishSong", queue => queue.textChannel?.send("Finish song!"))
    // .on("disconnect", queue => queue.textChannel?.send("Disconnected!"))
    // .on("empty", queue =>
    //   queue.textChannel?.send("The voice channel is empty! Leaving the voice channel...")
    // )
    // DisTubeOptions.searchSongs > 1
    .on("searchResult", (message, result) => {
      let i = 0;
      message.channel.send(
        `**Wybież sobie literkę z alfabetu**\n${result
          .map(
            song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
          )
          .join("\n")}\n*Wybież lub czekaj 30 sek na eksterminację*`
      );
    })
    .on("searchCancel", message => message.channel.send("Szukanie anichilowane"))
    .on("searchInvalidAnswer", message =>
      message.channel.send("Coś się popsuło")
    )
    .on("searchNoResult", message => message.channel.send("Ni ma!"))
    .on("searchDone", () => {});
}