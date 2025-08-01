const { TOKEN } = require("./config.json");
const { ShardingManager } = require("discord.js");
const shards = new ShardingManager("./index.js", { // zmieniłem "./bot.js" na "./index.js"
  token: TOKEN,
  totalShards: "auto", // automatycznie oblicza liczbę shardów
});

shards.on("shardCreate", shard => console.log(`Uruchomiono shard ${shard.id}`));
shards.spawn().catch(console.error);
