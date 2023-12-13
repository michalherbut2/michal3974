# 🤖 michal3974 - polski, wyborny bot na discorda

> michal3974 to bot discordowy napisany w discord.js v14

## Wymagania

1. Zrób własny token bota **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**  
   1.1. Włącz 'Message Content Intent' w zakładce Bot na Discord Developer Portal
2. Używam Node.js v20.9.0 lub v21.4.0

## 🚀 Instalacja

```sh
git clone git@github.com:michalherbut2/michal3974.git
cd michal3974
npm i
```

Po instalacji skonfiguruj bota i odpal `npm start`, żeby odpalić bota.

## ⚙️ Konfiguracja / Configuration

Stwórz plik `config.json` i wypełnij go:

⚠️ **Uwaga: nigdy nie udostępniaj publicznie swojego tokena ani kluczy API** ⚠️

```json
{
  "prefix": "",
  "token": "",
  "GUILD_ID": "",
  "ROLE_ID": "",
  "clientId": "",
  "guildId": ""
}
```

## 📝 Funkcje i komendy
### 🎶 muzyczne
- Słuchaj muzyki z youtube, podaj nazwe piosenki lub link
- `/play polskie szamba`
- `/skip` - skipuje aktualną pisoenkę lub o danym numerze
- `pause` - pauzuje muzykę
- `unpause` - wznawia muzykę
- `queue` - wyświetla kolejkę piosenek
- `stop` - kończy zabawę
- `/panel` - daje panel
- `/radio` - odpala radio
- `/pętla` - gra ciągle tą samą piosenkę

### 🌐 ogólne:
- `/nb` - pokazuje nieobecnośći adminów

### ⚠️ ostrzeżenia:
- `/poka_wszystkie_ostrzezenia` - pokazuje wszystkie ostrzeżenia
- `/poka_ostrzezenia` - pokazuje ostrzeżenia danej osoby

### ➕ plusy:
- `/poka_wszystkie_plusy` - pokazuje wszystkie plusy
- `/poka_plusy` - pokazuje plusy danej osoby

### 👷 dla adminów:
- `/ostrzezenie dodaj` - dodaje ostrzeżenie danej osoby
- `/ostrzezenie usun` - usuwa ostrzeżenie danej osoby
- `/ostrzezenie czysc` - usuwa wszystkie ostrzeżenia danej osoby
- `/config` - konfiguruje działanie bota 
- `/sprawdzaj_nieobecnosci` - sprawdza nieobecnośći

🌐 Dodaj bota na swój serwer Discord!
Dodaj bota na swój serwer, klikając w **[link](https://discord.com/api/oauth2/authorize?client_id=1005161253129433158&permissions=4331669504&scope=bot)**.

Dziękuję za zainteresowanie michal3974! Jeśli masz pytania lub potrzebujesz pomocy, śmiało pytaj! 🤖🚀
