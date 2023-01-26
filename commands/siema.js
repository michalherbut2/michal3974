// module.exports = {
//   config: {
//     name: "siema",
//     description: "Replay siema",
//     usage: `siema`,
//   },

//   /**
//    * @param {Client} client
//    * @param {Message} message
//    * @param {String[]} args
//    */

//   run: async (client, message, args) => {
//     message.channel.send(`Siema 👋`);
//   },
// };

exports.help = {
  name: "siema",
};

exports.run = async (client, message, args) => {
  message.channel.send("Siema 👋");
};