const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../computings/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Pokazuje listę piosenek do zagrania"),
  
  async execute(interaction) {
    const { client } = interaction;
    const queue = client.queue.get(message.guild.id).queue;

    if (!queue.length)
      sendEmbed(interaction, {
        description: "Ludzie, tu niczego nie ma!",
      });
    else {
      const description = `## Kolejka:\n${queue
        .map(
          (song, id) =>
            `**${id ? id : "Gram"}**: ${song.metadata.title} - \`${
              song.metadata.duration
            }\``
        )
        .join("\n")}`;

      sendEmbed(interaction, { description });
    }
  },
};
