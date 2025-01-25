const { SlashCommandBuilder } = require("discord.js");
const sendEmbed = require("../../../functions/messages/sendEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Pokazuje listę piosenek do zagrania"),

  async execute(interaction) {
    try {
      const { client } = interaction;
      const serverQueue = client.queue.get(interaction.guild.id);

      if (!serverQueue || !serverQueue.queue.length) {
        await sendEmbed(interaction, {
          description: "Ludzie, tu niczego nie ma!",
        });
      } else {
        const description = `## Kolejka:\n${serverQueue.queue
          .map(
            (song, id) =>
              `**${id === 0 ? "Gram" : id}**: ${song.metadata.title} - \`${
                song.metadata.duration
              }\``
          )
          .join("\n")}`;
        
        await sendEmbed(interaction, { description });
      }
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'queue':", error);
      await sendEmbed(interaction, {
        description: "Wystąpił błąd podczas wyświetlania kolejki piosenek.",
        ephemeral: true,
      });
    }
  },
};