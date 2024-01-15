const { SlashCommandBuilder } = require('@discordjs/builders');
const { createWarningEmbed } = require("../../computings/createEmbed");
const getResource = require("../../computings/getResource");
const createVoiceConnection = require("../../computings/createVoiceConnection");
const playMusic = require("../../computings/playMusic");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playfile')
    .setDescription('Odtwarza plik audio')
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('Plik do odtworzenia')
        .setRequired(true)),
  async execute(interaction) {
    try {
      const voiceConnection = createVoiceConnection(interaction);
      const file = interaction.options.getAttachment('file');
      if (!file) {
        return await interaction.reply({
          embeds: [createWarningEmbed("Proszę załączyć plik!")],
          ephemeral: true
        });
      }
      const search = file.url;
      const audioResource = await getResource(search);

      playMusic(interaction, audioResource, voiceConnection);
    } catch (error) {
      console.error("Problem:", error);
      interaction.reply({
        embeds: [
          createWarningEmbed(`Wystąpił błąd podczas odtwarzania pliku.`),
          createWarningEmbed(error.message),
        ],
        ephemeral: true
      });
    }
  },
};
