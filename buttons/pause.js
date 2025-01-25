module.exports = {
  data: {
    name: 'pause'
  },
  async execute(interaction) {
    try {
      // Sprawdzenie, czy guild istnieje
      if (!interaction.guild) {
        return interaction.reply({ 
          content: 'Nie można wykonać polecenia poza serwerem.', 
          ephemeral: true 
        });
      }

      // Pobranie kolejki dla danego serwera
      const serverQueue = interaction.client.queue.get(interaction.guild.id);
      
      // Sprawdzenie, czy kolejka istnieje
      if (!serverQueue) {
        return interaction.reply({ 
          content: 'Aktualnie nie ma żadnej aktywnej kolejki muzycznej.', 
          ephemeral: true 
        });
      }

      // Sprawdzenie, czy odtwarzacz istnieje
      if (!serverQueue.player) {
        return interaction.reply({ 
          content: 'Nie można wstrzymać odtwarzania.', 
          ephemeral: true 
        });
      }

      // Wstrzymanie odtwarzania
      serverQueue.player.pause();

      // Potwierdzenie wstrzymania
      await interaction.reply({ 
        content: 'Muzyka została wstrzymana ⏸️', 
        ephemeral: true 
      });

    } catch (error) {
      console.error('Błąd podczas wstrzymywania muzyki:', error);
      
      // Obsługa nieoczekiwanych błędów
      await interaction.reply({ 
        content: 'Wystąpił błąd podczas próby wstrzymania muzyki.', 
        ephemeral: true 
      });
    }
  },
};