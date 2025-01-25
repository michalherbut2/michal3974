module.exports = {
 data: {
   name: 'unpause'
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
         content: 'Nie można wznowić odtwarzania.', 
         ephemeral: true 
       });
     }

     // Wznowienie odtwarzania
     serverQueue.player.unpause();

     // Potwierdzenie wznowienia
     await interaction.reply({ 
       content: 'Muzyka została wznowiona ▶️', 
       ephemeral: true 
     });

   } catch (error) {
     console.error('Błąd podczas wznawiania muzyki:', error);
     
     // Obsługa nieoczekiwanych błędów
     await interaction.reply({ 
       content: 'Wystąpił błąd podczas próby wznowienia muzyki.', 
       ephemeral: true 
     });
   }
 },
};