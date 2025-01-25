# 🤖 **michal3974** - Polski, Wyborny Bot na Discorda

> **michal3974** to bot Discordowy stworzony w **discord.js v14**, zaprojektowany z myślą o **Node.js v22**.

## 🛠️ Kompatybilne Wersje Node.js

Bot jest kompatybilny z następującymi wersjami Node.js:

- **Node.js v22** – **Zalecana i najstabilniejsza wersja** do użycia od wersji 2.5 bota.
- **Node.js v20, v21, v23** – Obsługiwane, bot działa poprawnie, ale wersja v22 jest najbardziej stabilna.
- **Inne wersje** – Może działać, ale nie były testowane.

**Zalecenie:** **Node.js v22** jest zalecaną wersją od wersji 2.5 bota i zapewnia najlepszą stabilność. Stosowanie najnowszej stabilnej wersji w obrębie tej wersji (np. v22.x.x) jest najlepszym rozwiązaniem dla optymalnej wydajności i bezpieczeństwa.

## Wymagania

1. **Stwórz własny token bota** – Zgodnie z tym **[przewodnikiem](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**.  
   1.1. Włącz 'Message Content Intent' w zakładce Bot na **Discord Developer Portal**.
2. Używaj jednej z kompatybilnych wersji **Node.js** (v20, v21, v22, v23).

## 🚀 Instalacja

```sh
git clone git@github.com:michalherbut2/michal3974.git
cd michal3974
npm i
```

Po instalacji, skonfiguruj bota i uruchom go komendą:

```sh
node bot.js
```

## ⚙️ Konfiguracja

Stwórz plik `config.json` i wypełnij go swoimi danymi:

⚠️ **Uwaga: nigdy nie udostępniaj publicznie swojego tokena ani kluczy API!** ⚠️

```json
{
  "prefix": "",
  "TOKEN": "",
  "GUILD_ID": "",
  "ROLE_ID": "",
  "CLIENT_ID": "",
  "guildId": ""
}
```

## 📝 Funkcje i komendy

### 🎶 Muzyczne:
- **/play [nazwa piosenki lub link]** – Odtwarza muzykę z YouTube.
- **/skip** – Pomija aktualnie odtwarzaną piosenkę (lub piosenkę o danym numerze).
- **/pause** – Pauzuje muzykę.
- **/unpause** – Wznawia muzykę.
- **/queue** – Wyświetla kolejkę piosenek.
- **/stop** – Kończy zabawę.
- **/panel** – Otwiera panel sterowania.
- **/radio** – Odpala radio.
- **/pętla** – Powtarza tę samą piosenkę w kółko.

### 🌐 Ogólne:
- **/nb** – Pokazuje nieobecności administratorów.

### ⚠️ Ostrzeżenia:
- **/poka_wszystkie_ostrzezenia** – Wyświetla wszystkie ostrzeżenia.
- **/poka_ostrzezenia [osoba]** – Pokazuje ostrzeżenia danej osoby.

### ➕ Plusy:
- **/poka_wszystkie_plusy** – Wyświetla wszystkie plusy.
- **/poka_plusy [osoba]** – Pokazuje plusy danej osoby.

### 👷 Dla adminów:
- **/ostrzezenie dodaj [osoba]** – Dodaje ostrzeżenie danej osobie.
- **/ostrzezenie usun [osoba]** – Usuwa ostrzeżenie danej osoby.
- **/ostrzezenie czysc [osoba]** – Usuwa wszystkie ostrzeżenia danej osoby.
- **/config** – Umożliwia konfigurację bota.
- **/sprawdzaj_nieobecnosci** – Sprawdza nieobecności administratorów.

## 🌐 Dodaj bota na swój serwer Discord!

Aby dodać bota do swojego serwera, kliknij w **[link](https://discord.com/api/oauth2/authorize?client_id=1005161253129433158&permissions=4331669504&scope=bot)**.



Dziękuję za zainteresowanie **michal3974**! Jeśli masz pytania lub potrzebujesz pomocy, nie wahaj się zapytać! 🤖🚀
