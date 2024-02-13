// Importowanie potrzebnych modułów
const { Client, Intents } = require('discord.js');
const Database = require('better-sqlite3');

// Kolekcja aut
let auta = [
    'Audi RS6 Avant',
    'BMW M3',
    'Mercedes AMG GT',
    'Porsche 911 GT3',
    'Ferrari 488 Pista',
    'Lamborghini Aventador SVJ',
    'McLaren 720S',
    'Aston Martin DBS Superleggera',
    'Bentley Continental GT',
    'Rolls-Royce Phantom',
    'Bugatti Chiron',
    'Koenigsegg Jesko',
    'Toyota Supra',
    'Nissan GT-R',
    'Chevrolet Camaro',
    'Ford Mustang GT',
    'Dodge Challenger SRT',
    'Volkswagen Golf GTI',
    'Subaru WRX STI',
    'Honda Civic Type R',
    // ... dodaj resztę modeli aut ...
    'Jaguar F-Type',
    'Maserati GranTurismo',
    'Aston Martin Vantage',
    'Lexus LC',
    'Cadillac CTS-V',
    'Alfa Romeo Giulia Quadrifoglio',
    'Jeep Grand Cherokee Trackhawk',
    'Land Rover Range Rover Sport SVR',
    'Porsche Cayenne Turbo',
    'BMW X5 M',
    'Mercedes-AMG GLE 63',
    'Audi RS Q8',
    'Lamborghini Urus',
    'Bentley Bentayga',
    'Rolls-Royce Cullinan',
    'Bugatti Divo',
    'Koenigsegg Agera RS',
    'Hennessey Venom GT',
    'SSC Tuatara',
    'Rimac C_Two',
    'Tesla Model S Plaid',
    'Lucid Air Dream Edition',
    'NIO EP9',
    'Pininfarina Battista',
    'Lotus Evija',
    'Aston Martin Valkyrie',
    'Mercedes-AMG Project One',
    'McLaren Speedtail',
    'Bugatti La Voiture Noire',
    'Pagani Huayra BC',
    'Ferrari SF90 Stradale',
    'Lamborghini Sian FKP 37',
    'Porsche 918 Spyder',
    'McLaren P1',
    'Aston Martin One-77',
    'Bugatti Veyron Super Sport',
    'Koenigsegg One:1',
    'Hennessey Venom F5',
    'SSC Ultimate Aero TT',
    'Rimac Concept_One',
    'Tesla Roadster (2022)',
    'Lucid Air Grand Touring',
    'NIO ES8',
    'Pininfarina Pura Vision',
    'Lotus Evora GT',
    'Aston Martin DB11',
    'Mercedes-AMG GT R',
    'McLaren 600LT',
    'Bugatti Centodieci',
    'Pagani Zonda Cinque',
    'Ferrari LaFerrari',
    'Lamborghini Centenario',
    'Porsche Taycan Turbo S',
    'McLaren GT',
    'Aston Martin Rapide E',
    'Bugatti Bolide',
    'Pagani Imola',
    'Ferrari Roma',
    'Lamborghini Huracan EVO',
    'Porsche Panamera Turbo S E-Hybrid',
    'McLaren 765LT',
    'Aston Martin DBX',
    'Bugatti Chiron Pur Sport',
    'Pagani Huayra Roadster BC',
    'Ferrari Portofino M',
    'Lamborghini Aventador SVJ Roadster',
    'Porsche 911 GT2 RS',
    'McLaren 720S Spider',
    'Aston Martin V12 Speedster',
    'Bugatti Chiron Super Sport 300+',
    'Pagani Huayra R',
    'Ferrari 812 Superfast',
    'Lamborghini Essenza SCV12',
    'Porsche 911 Turbo S',
    'McLaren Elva',
    'Aston Martin Victor',
    'Bugatti Chiron Sport',
    'Pagani Zonda Revolucion',
    'Ferrari F8 Tributo',
    'Lamborghini Gallardo',
    'Porsche Carrera GT',
    'McLaren F1',
    'Aston Martin Vanquish'
];


// Tworzenie bazy danych i tabeli
const db = new Database('garaz.db');
db.exec(`CREATE TABLE IF NOT EXISTS garaz (user TEXT, auto TEXT, ostatnieLosowanie INTEGER, ilosc INTEGER DEFAULT 1);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_user ON garaz(user);`); // Indeksowanie kolumny user

// Funkcja do losowania auta
function losujAuto(user) {
    try {
        let stmt = db.prepare('SELECT auto FROM garaz WHERE user = ?');
        let autaUzytkownika = stmt.all(user).map(row => row.auto);

        let dostepneAuta = auta.filter(auto => !autaUzytkownika.includes(auto));
        if (dostepneAuta.length === 0) {
            dostepneAuta = auta; // Jeśli użytkownik ma już wszystkie auta, resetujemy listę
        }

        let indexAuto = Math.floor(Math.random() * dostepneAuta.length);
        let auto = dostepneAuta[indexAuto];

        // Dodajemy auto do garażu użytkownika w bazie danych
        let autoWGarazu = db.prepare('SELECT * FROM garaz WHERE user = ? AND auto = ?').get(user, auto);
        if (autoWGarazu) {
            db.prepare('UPDATE garaz SET ilosc = ilosc + 1 WHERE user = ? AND auto = ?').run(user, auto);
        } else {
            db.prepare('INSERT INTO garaz (user, auto, ostatnieLosowanie) VALUES (?, ?, ?)').run(user, auto, Date.now());
        }

        return auto;
    } catch (error) {
        console.error(`Wystąpił błąd podczas losowania auta: ${error}`);
    }
}

// Komenda /auto_losuj
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'auto_losuj') {
        let teraz = Date.now();
        let stmt = db.prepare('SELECT ostatnieLosowanie FROM garaz WHERE user = ? ORDER BY ostatnieLosowanie DESC LIMIT 1');
        let ostatnie = stmt.get(interaction.user.id);
        let roznicaCzasu = teraz - (ostatnie ? ostatnie.ostatnieLosowanie : 0);

        // Sprawdzamy, czy minęło 24 godziny od ostatniego losowania
        if (roznicaCzasu < 24 * 60 * 60 * 1000) {
            await interaction.reply('Możesz losować auto tylko raz na 24 godziny. Spróbuj ponownie później.');
        } else {
            let auto = losujAuto(interaction.user.id);
            await interaction.reply(`Wylosowałeś auto: ${auto}`);
        }
    } else if (commandName === 'garaz') {
        let stmt = db.prepare('SELECT auto, ilosc FROM garaz WHERE user = ?');
        let autaUzytkownika = stmt.all(interaction.user.id).map(row => `• ${row.auto} (${row.ilosc})`).join('\n');
        await interaction.reply(`Twoje auta:\n${autaUzytkownika}`);
    }
});
