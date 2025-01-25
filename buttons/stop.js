module.exports = {
 data: {
   name: 'stop'
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

     // Czyszczenie kolejki
     serverQueue.queue = [];

     // Zatrzymanie odtwarzacza
     if (serverQueue.player) {
       serverQueue.player.stop();
     }

     // Potwierdzenie zatrzymania
     await interaction.reply({ 
       content: 'Muzyka została zatrzymana. Kolejka wyczyszczona. 🛑', 
       ephemeral: true 
     });

   } catch (error) {
     console.error('Błąd podczas zatrzymywania muzyki:', error);
     
     // Obsługa nieoczekiwanych błędów
     await interaction.reply({ 
       content: 'Wystąpił błąd podczas próby zatrzymania muzyki.', 
       ephemeral: true 
     });
   }
 },
};