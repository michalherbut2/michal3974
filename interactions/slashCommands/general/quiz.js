const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  Collection,
} = require("discord.js");
const {
  createSimpleEmbed,
  createWarningEmbed,
  createSuccessEmbed,
} = require("../../../functions/messages/createEmbed");

const quizzes = [
  {
    category: "Matematyka",
    questions: [
      {
        question: "Ile wynosi 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correct: "4",
      },
      {
        question: "Ile wynosi 5 * 5?",
        answers: ["20", "25", "30", "35"],
        correct: "25",
      },
      {
        question: "Ile wynosi 3^4?",
        answers: ["27", "64", "81", "125"],
        correct: "81",
      },
      {
        question: "Rozwiąż równanie: 2x + 5 = 15",
        answers: ["4", "5", "6", "7"],
        correct: "5",
      },
      {
        question: "Jaki jest iloczyn 8 i 7?",
        answers: ["48", "54", "56", "64"],
        correct: "56",
      },
      {
        question: "Jaka jest pierwiastek kwadratowy z 9?",
        answers: ["2", "3", "4", "5"],
        correct: "3",
      },
    ],
  },
  {
    category: "Historia",
    questions: [
      {
        question: "W którym roku wybuchła II wojna światowa?",
        answers: ["1935", "1938", "1939", "1941"],
        correct: "1939",
      },
      {
        question: "W którym roku rozpadła się ZSRR?",
        answers: ["1989", "1991", "1993", "1995"],
        correct: "1991",
      },
      {
        question: "Kto był prezydentem USA podczas wojny secesyjnej?",
        answers: [
          "Abraham Lincoln",
          "Andrew Johnson",
          "Ulysses S. Grant",
          "James Buchanan",
        ],
        correct: "Abraham Lincoln",
      },
      {
        question:
          "Który kraj był pierwszym, który wprowadził powszechne prawo wyborcze dla kobiet?",
        answers: [
          "Stany Zjednoczone",
          "Wielka Brytania",
          "Nowa Zelandia",
          "Szwecja",
        ],
        correct: "Nowa Zelandia",
      },
      {
        question: "Kto był przywódcą rewolucji październikowej w Rosji?",
        answers: ["Lenin", "Stalin", "Trocki", "Chruszczow"],
        correct: "Lenin",
      },
      {
        question: "Kto był pierwszym prezydentem Stanów Zjednoczonych?",
        answers: [
          "George Washington",
          "Thomas Jefferson",
          "Abraham Lincoln",
          "John Adams",
        ],
        correct: "George Washington",
      },
    ],
  },
  {
    category: "Twierdza: Edycja Ostateczna",
    questions: [
      {
        question:
          'W którym roku została wydana gra "Twierdza: Edycja Ostateczna"?',
        answers: ["2010", "2014", "2018", "2023"],
        correct: "2023",
      },
      {
        question:
          'Który zasób jest najważniejszy dla rozbudowy twierdzy w grze "Twierdza: Edycja Ostateczna"?',
        answers: ["Kamień", "Drewno", "Złoto", "Żywność"],
        correct: "Kamień",
      },
      {
        question:
          'Jaka jednostka wojskowa jest najskuteczniejsza przeciwko oblężeniom w grze "Twierdza: Edycja Ostateczna"?',
        answers: ["Łucznicy", "Katapulty", "Mangonel", "Rycerze"],
        correct: "Katapulty",
      },
      {
        question: 'Jaki jest główny cel w grze "Twierdza: Edycja Ostateczna"?',
        answers: [
          "Budowanie i rozbudowa twierdzy",
          "Zbieranie zasobów",
          "Walcz z przeciwnikami",
          "Wszystkie powyższe odpowiedzi",
        ],
        correct: "Wszystkie powyższe odpowiedzi",
      },
    ],
  },
  {
    category: "Gry",
    questions: [
      {
        question:
          'W jakim roku została wydana gra "The Legend of Zelda: Breath of the Wild"?',
        answers: ["2015", "2016", "2017", "2018"],
        correct: "2017",
      },
      {
        question: 'Która gra zdobyła tytuł "Gra Roku" na The Game Awards 2021?',
        answers: [
          "Cyberpunk 2077",
          "Resident Evil Village",
          "It Takes Two",
          "Deathloop",
        ],
        correct: "It Takes Two",
      },
      {
        question: "Która z poniższych gier należy do gatunku battle royale?",
        answers: [
          "The Witcher 3: Wild Hunt",
          "Fortnite",
          "Assassin's Creed: Valhalla",
          "Red Dead Redemption 2",
        ],
        correct: "Fortnite",
      },
      {
        question: 'Kto jest twórcą serii gier "Metal Gear Solid"?',
        answers: [
          "Hideo Kojima",
          "Shigeru Miyamoto",
          "Todd Howard",
          "Gabe Newell",
        ],
        correct: "Hideo Kojima",
      },
      {
        question: 'Która gra zdobyła tytuł "Gra Roku" na The Game Awards 2020?',
        answers: [
          "The Last of Us Part II",
          "Hades",
          "Animal Crossing: New Horizons",
          "Doom Eternal",
        ],
        correct: "The Last of Us Part II",
      },
      {
        question:
          'Która firma jest odpowiedzialna za stworzenie serii gier "The Elder Scrolls"?',
        answers: ["Bioware", "Bethesda Game Studios", "Ubisoft", "CD Projekt"],
        correct: "Bethesda Game Studios",
      },
    ],
  },
  {
    category: "Ogólne",
    questions: [
      {
        question: 'Która planeta jest znana jako "Czerwona Planeta"?',
        answers: ["Mars", "Jowisz", "Wenus", "Saturn"],
        correct: "Mars",
      },
      {
        question: "Ile wynosi pierwiastek kwadratowy z liczby 16?",
        answers: ["2", "4", "8", "16"],
        correct: "4",
      },
      {
        question: 'Który z elementów chemicznych ma symbol "O"?',
        answers: ["Osm", "Olo", "Ogon", "Tlen"],
        correct: "Tlen",
      },
      {
        question:
          "Które państwo było gospodarzem Letnich Igrzysk Olimpijskich w 2016 roku?",
        answers: ["Chiny", "Brazylia", "Rosja", "Stany Zjednoczone"],
        correct: "Brazylia",
      },
      {
        question: "Które zwierzę jest największe na świecie?",
        answers: ["Słoń", "Wieloryb błękitny", "Żyrafa", "Hipopotam"],
        correct: "Wieloryb błękitny",
      },
      {
        question:
          "W którym roku odbyła się pierwsza podróż człowieka na Księżyc?",
        answers: ["1964", "1969", "1975", "1982"],
        correct: "1969",
      },
      {
        question: "Który kraj jest największym producentem kawy na świecie?",
        answers: ["Brazylia", "Wietnam", "Kolumbia", "Etiopia"],
        correct: "Brazylia",
      },
      {
        question: "Ile kontynentów jest na Ziemi?",
        answers: ["4", "5", "6", "7"],
        correct: "7",
      },
      {
        question: "Która rzeka jest najdłuższą na świecie?",
        answers: ["Nil", "Amazonka", "Jangcy", "Missisipi"],
        correct: "Nil",
      },
      {
        question: 'Kto napisał "Romeo i Julia"?',
        answers: [
          "William Shakespeare",
          "Jane Austen",
          "Charles Dickens",
          "Fyodor Dostoevsky",
        ],
        correct: "William Shakespeare",
      },
      {
        question: "Która planeta jest najbliższa Słońcu?",
        answers: ["Merkury", "Wenus", "Mars", "Jowisz"],
        correct: "Merkury",
      },
      {
        question: "Które zwierzę jest symbolizowane przez znak zodiaku Lew?",
        answers: ["Kot", "Pies", "Lew", "Tygrys"],
        correct: "Lew",
      },
      {
        question: "W którym roku rozpoczęła się II wojna światowa?",
        answers: ["1935", "1938", "1939", "1941"],
        correct: "1939",
      },
      {
        question: "Ile wynosi pierwiastek kwadratowy z liczby 25?",
        answers: ["3", "5", "7", "9"],
        correct: "5",
      },
      {
        question: "Które morze leży pomiędzy Europą a Afryką?",
        answers: [
          "Morze Śródziemne",
          "Morze Czarne",
          "Morze Północne",
          "Morze Bałtyckie",
        ],
        correct: "Morze Śródziemne",
      },
      {
        question: "Kto był pierwszym prezydentem Stanów Zjednoczonych?",
        answers: [
          "George Washington",
          "Thomas Jefferson",
          "Abraham Lincoln",
          "John Adams",
        ],
        correct: "George Washington",
      },
      {
        question:
          "Które państwo jest największe pod względem powierzchni na świecie?",
        answers: ["Rosja", "Kanada", "Chiny", "Stany Zjednoczone"],
        correct: "Rosja",
      },
    ],
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quiz_start")
    .setDescription("Rozpocznij quiz"),

  async execute(interaction) {
    try {
      const startTime = Date.now();
      const users = new Set();
      const waitingTime = 60; // seconds

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("join_button")
          .setLabel("Dołącz")
          .setEmoji("👍")
          .setStyle(ButtonStyle.Primary)
      );

      let count = 0;
      await interaction.reply({
        embeds: [
          createSimpleEmbed(
            `Rozpoczynamy quiz! Aby dołączyć, kliknij przycisk poniżej.\nZapisy trwają przez <t:${
              Math.floor(startTime / 1000) + waitingTime
            }:R> sekund. :smiley:\nLiczba uczestników: ${count}`
          ),
        ],
        components: [row],
      });

      const filter = i => i.customId === "join_button" && !i.user.bot;

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: waitingTime * 1000,
      });

      collector.on("collect", i => {
        if (users.has(i.user.id)) {
          i.reply({
            embeds: [createWarningEmbed(`Już dołączył(a): ${i.user.username}!`)],
            ephemeral: true,
          });
          return setTimeout(() => i.deleteReply(), 3000);
        }

        users.add(i.user.id);
        i.reply({
          embeds: [createSimpleEmbed(`Dołączył(a): ${i.user.username}`)],
          ephemeral: true,
        });
        setTimeout(() => i.deleteReply(), 3000);

        interaction.editReply({
          embeds: [
            createSimpleEmbed(
              `Rozpoczynamy quiz! Aby dołączyć, kliknij przycisk poniżej.\nZapisy trwają przez <t:${
                Math.floor(startTime / 1000) + waitingTime
              }:R> sekund. :smiley:\nLiczba uczestników: ${++count}`
            ),
          ],
          components: [row],
        });
      });

      collector.on("end", collected => {
        const quizParticipants = new Collection();
        collected.forEach(i => quizParticipants.set(i.user.id, { score: 0 }));

        if (quizParticipants.size) {
          startQuiz(interaction, quizParticipants);
        } else {
          interaction.deleteReply();
        }
      });
    } catch (error) {
      console.error('Error during quiz setup:', error);
      await interaction.reply({
        content: "Wystąpił błąd podczas uruchamiania quizu!",
        ephemeral: true,
      });
    }
  },
};

async function startQuiz(interaction, quizParticipants) {
  try {
    const users = new Set();
    const guessingTime = 20; // seconds

    for (let currentQuestionIndex = 0; currentQuestionIndex < quizzes.length; currentQuestionIndex++) {
      const quiz = quizzes[currentQuestionIndex];
      const question = quiz.questions[Math.floor(Math.random() * quiz.questions.length)];
      const shuffledAnswers = shuffleArray(question.answers);

      const questionEmbed = new EmbedBuilder()
        .setTitle(
          `Kategoria: ${quiz.category} <t:${Math.floor(Date.now() / 1000) + guessingTime}:R>`
        )
        .setDescription(question.question)
        .addFields(
          shuffledAnswers.map((answer, index) => ({
            name: "\u200B",
            value: `**${index + 1}.** ${answer}`,
            inline: true,
          }))
        )
        .setColor("#3498db");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("1").setEmoji("1️⃣").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("2").setEmoji("2️⃣").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("3").setEmoji("3️⃣").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("4").setEmoji("4️⃣").setStyle(ButtonStyle.Primary)
      );

      await interaction.editReply({
        embeds: [questionEmbed],
        components: [row],
      });

      const filter = i => {
        const choice = parseInt(i.customId);
        return (
          !isNaN(choice) &&
          choice > 0 &&
          choice <= shuffledAnswers.length &&
          quizParticipants.has(i.user.id)
        );
      };

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: guessingTime * 1000,
      });

      collector.on("collect", async i => {
        if (users.has(i.user.id)) {
          await i.reply({
            embeds: [createWarningEmbed(`${i.user.username} już udzielił(a) odpowiedzi!`)],
            ephemeral: true,
          });
          return setTimeout(() => i.deleteReply(), 3000);
        }

        users.add(i.user.id);
        const userChoice = parseInt(i.customId);
        const correctIndex = shuffledAnswers.indexOf(question.correct);
        const participant = quizParticipants.get(i.user.id);

        if (userChoice === correctIndex + 1) {
          await i.reply({
            embeds: [createSuccessEmbed(`Brawo! ${i.user.username} udzielił(a) poprawnej odpowiedzi!`)],
            ephemeral: true,
          });
          participant.score++;
          setTimeout(() => i.deleteReply(), 3000);
        } else {
          await i.reply({
            embeds: [createWarningEmbed(`Niestety, odpowiedź niepoprawna, ${i.user.username}. Prawidłowa odpowiedź to: ${question.correct}`)],
            ephemeral: true,
          });
          setTimeout(() => i.deleteReply(), 3000);
        }
      });

      collector.on("end", () => {
        if (currentQuestionIndex < quizzes.length - 1) {
          startQuiz(interaction, quizParticipants);
        } else {
          showResults(interaction, quizParticipants);
        }
      });

      await new Promise(resolve => setTimeout(resolve, guessingTime * 1000 + 500));
    }
  } catch (error) {
    console.error('Error during quiz execution:', error);
    await interaction.reply({
      content: "Wystąpił błąd podczas quizu!",
      ephemeral: true,
    });
  }
}

function showResults(interaction, quizParticipants) {
  const sortedParticipants = Array.from(quizParticipants.entries()).sort(
    (a, b) => b[1].score - a[1].score
  );

  const resultsEmbed = new EmbedBuilder()
    .setTitle("Wyniki Quizu")
    .setColor("#3498db");

  sortedParticipants.forEach(([userId, participant], index) => {
    resultsEmbed.addFields({
      name: `${index + 1}. <@${userId}>`,
      value: `${participant.score} punktów`,
      inline: true,
    });
  });

  interaction.editReply({ embeds: [resultsEmbed], components: [] });
}

function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function isFirstCharacterEmoji(str) {
  if (str.length === 0) {
    return false;
  }

  const firstCharCode = str.codePointAt(0);

  return (
    (firstCharCode >= 0x1f600 && firstCharCode <= 0x1f64f) ||
    (firstCharCode >= 0x1f300 && firstCharCode <= 0x1f5ff) ||
    (firstCharCode >= 0x1f680 && firstCharCode <= 0x1f6ff) ||
    (firstCharCode >= 0x1f700 && firstCharCode <= 0x1f77f) ||
    (firstCharCode >= 0x1f780 && firstCharCode <= 0x1f7ff) ||
    (firstCharCode >= 0x1f800 && firstCharCode <= 0x1f8ff) ||
    (firstCharCode >= 0x1f900 && firstCharCode <= 0x1f9ff) ||
    (firstCharCode >= 0x1fa00 && firstCharCode <= 0x1fa6f) ||
    (firstCharCode >= x0x2600 && firstCharCode <= 0x26ff) ||
    (firstCharCode >= 0x2700 && firstCharCode <= 0x27bf)
  );
}