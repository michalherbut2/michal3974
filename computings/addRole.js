const { MessageEmbed } = require('discord.js');

module.exports = async (interaction, userId, roleId) => {
  const guild = interaction.guild;
  const channel = interaction.channel;
  const member = guild.members.cache.get(userId);
  const roleToAssign = guild.roles.cache.get(roleId);

  if (!roleToAssign) {
    console.error("Rola nie została znaleziona.");
    return;
  }

  if (member) {
    if (member.roles.cache.has(roleId)) {
      // Stworzenie osadzenia dla wiadomości "Masz już tę rolę"
      const embed = new MessageEmbed()
        .setColor('#FF0000') // Możesz dostosować kolor
        .setTitle('Błąd')
        .setDescription('Masz już tę rolę.');

      channel.send({ embeds: [embed] });
    } else {
      // Dodanie roli do członka
      member.roles
        .add(roleToAssign)
        .then(() => {
          // Stworzenie osadzenia dla wiadomości "Dodano rolę"
          const embed = new MessageEmbed()
            .setColor('#00FF00') // Możesz dostosować kolor
            .setTitle('Sukces')
            .setDescription(`Dodano rolę ${roleToAssign?.name}!`);

          channel.send({ embeds: [embed] });
        })
        .catch((error) => {
          // Stworzenie osadzenia dla wiadomości błędu
          const embed = new MessageEmbed()
            .setColor('#FF0000') // Możesz dostosować kolor
            .setTitle('Błąd')
            .setDescription('Wystąpił problem podczas próby przydzielenia roli.');

          channel.send({ embeds: [embed] });

          console.error("Błąd podczas przydzielania roli:", error);
        });
    }
  }
};
