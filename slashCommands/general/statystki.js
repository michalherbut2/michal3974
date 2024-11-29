const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const os = require('os');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('statystyki')
    .setDescription('Pokaż statystyki bota Discord'),

  async execute(interaction) {
    const ramUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Zużycie RAMu w megabajtach
    const totalRam = os.totalmem() / 1024 / 1024; // Całkowita ilość RAMu w megabajtach
    const cpuUsage = process.cpuUsage().user / 1000000; // Zużycie CPU w sekundach

    const embed = new MessageEmbed()
      .setTitle('Statystyki bota Discord')
      .addField('Zużycie RAMu', `${ramUsage.toFixed(2)} MB / ${totalRam.toFixed(2)} MB`, true)
      .addField('Zużycie CPU', `${cpuUsage.toFixed(2)} s`, true)
      .addField('Liczba serwerów', `${interaction.client.guilds.cache.size}`, true)
      .addField('Liczba użytkowników', `${interaction.client.users.cache.size}`, true)
      .addField('Średni ping bota', `${interaction.client.ws.ping} ms`, true)
      .addField('Wersja Node.js', `${process.version}`, true)
      .setColor('#7289DA')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
