const { SlashCommandBuilder } = require("discord.js");
const { createSimpleEmbed } = require("../../../functions/messages/createEmbed");

const description = "Co można wybrać np. 🏰 Twierdza, możesz dać emoji na początku";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Tworzy głosowanie!")
    .addStringOption(option =>
      option
        .setName("opis")
        .setDescription("Opis tego, na co chcesz przeprowadzić głosowanie")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("opcja_1").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_2").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_3").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_4").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_5").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_6").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_7").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_8").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_9").setDescription(description)
    )
    .addStringOption(option =>
      option.setName("opcja_10").setDescription(description)
    ),
    
  async execute(interaction) {
    try {
      const content = "# 📊 " + interaction.options.getString("opis");
      let description = "";
      const reactions = [
        "🇦", "🇧", "🇨", "🇩", "🇪",
        "🇫", "🇬", "🇭", "🇮", "🇯"
      ];
      let reactionCount = 0;

      for (let i = 1; i <= 10; i++) {
        let str = interaction.options.getString("opcja_" + i);
        if (str) {
          if (isFirstCharacterEmoji(str)) {
            reactions[reactionCount] = String.fromCodePoint(str.codePointAt(0));
            str = str.substring(1).trim();
          } else {
            const regex = /<:([^:>]+):(\d+)>/;
            const match = str.match(regex);

            if (match) {
              const fullMatch = match[0];
              reactions[reactionCount] = fullMatch;
              str = str.substring(fullMatch.length).trim();
            }
          }

          str = `${reactions[reactionCount]} ${str}`;
          description += str + "\n";
          reactionCount++;
        }
      }

      if (description) {
        const embed = createSimpleEmbed(description);
        const message = await interaction.reply({
          content,
          embeds: [embed],
          fetchReply: true,
        });

        for (let i = 0; i < reactionCount; i++) {
          await message.react(reactions[i]);
        }
      } else {
        const message = await interaction.reply({ content, fetchReply: true });
        await message.react("👍");
        await message.react("👎");
      }
    } catch (error) {
      console.error("Błąd podczas wykonywania komendy 'poll':", error);
      await interaction.reply({
        content: "Wystąpił błąd podczas tworzenia głosowania!",
        ephemeral: true,
      });
    }
  },
};

function isFirstCharacterEmoji(str) {
  if (str.length === 0) {
    return false;
  }

  const firstCharCode = str.codePointAt(0);

  return (
    (firstCharCode >= 0x1f600 && firstCharCode <= 0x1f64f) ||
    (firstCharCode >= 0x1f300 && firstCharCode <= 0x1f5ff) ||
    (firstCharCode >= 0x1f680 && firstCharCode <= 0x1f6ff) ||
    (firstCharCode >= 0x1f700 && firstCharCode <= 0x1f77f) ||
    (firstCharCode >= 0x1f780 && firstCharCode <= 0x1f7ff) ||
    (firstCharCode >= 0x1f800 && firstCharCode <= 0x1f8ff) ||
    (firstCharCode >= 0x1f900 && firstCharCode <= 0x1f9ff) ||
    (firstCharCode >= 0x1fa00 && firstCharCode <= 0x1fa6f) ||
    (firstCharCode >= 0x2600 && firstCharCode <= 0x26ff) ||
    (firstCharCode >= 0x2700 && firstCharCode <= 0x27bf)
  );
}