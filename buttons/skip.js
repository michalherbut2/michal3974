module.exports = {
 data: {
   name: 'skip'
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
         content: 'Nie można przewinąć muzyki.', 
         ephemeral: true 
       });
     }

     // Przewinięcie do następnego utworu
     serverQueue.player.stop();

     // Potwierdzenie przewinięcia
     await interaction.reply({ 
       content: 'Przewinięto do następnego utworu ⏭️', 
       ephemeral: true 
     });

   } catch (error) {
     console.error('Błąd podczas przewijania muzyki:', error);
     
     // Obsługa nieoczekiwanych błędów
     await interaction.reply({ 
       content: 'Wystąpił błąd podczas próby przewinięcia muzyki.', 
       ephemeral: true 
     });
   }
 },
};