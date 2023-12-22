const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const openai = require('openai');

// Ustaw klucz API OpenAI - wymaga utworzenia konta na stronie OpenAI
const apiKey = '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';
const openaiInstance = new openai(apiKey);

const wierszCommand = {
  data: new SlashCommandBuilder()
    .setName('wiersz')
    .setDescription('Generuje inspirujący wiersz na podany temat')
    .addStringOption((option) =>
      option.setName('temat').setDescription('Temat wiersza').setRequired(true)
    ),
  async execute(interaction) {
    const temat = interaction.options.getString('temat');

    try {
      // Generowanie wiersza przy użyciu OpenAI GPT-3
      const wiersz = await generujWiersz(temat);

      // Odpowiedź na interakcję Slash Command
      await interaction.reply(`Oto wiersz na temat "${temat}":\n${wiersz}`);
    } catch (error) {
      console.error('Błąd podczas generowania wiersza:', error);
      await interaction.reply('Wystąpił błąd podczas generowania wiersza.');
    }
  },
};

async function generujWiersz(temat, jezyk = 'pl') {
  // Treść wstępnego tekstu z tematem
  const prompt = `Stwórz inspirujący wiersz na temat ${temat}`;

  // Parametry żądania do OpenAI GPT-3
  const parameters = {
    engine: 'davinci',
    temperature: 0.7,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: null,
  };

  try {
    // Generowanie wiersza przy użyciu OpenAI GPT-3
    const response = await openaiInstance.complete({
      prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    // Pobieranie wiersza z odpowiedzi GPT
    const wiersz = response.choices[0].text.trim();

    return wiersz;
  } catch (error) {
    console.error('Błąd podczas generowania wiersza:', error);
    throw error;
  }
}

module.exports = {
  data: wierszCommand.data.toJSON(),
  execute: wierszCommand.execute,
};
