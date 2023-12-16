const { Client, GatewayIntentBits } = require('discord.js');

const quizzes = [
  {
    category: 'Matematyka',
    questions: [
      {
        question: 'Ile wynosi 2 + 2?',
        answers: ['3', '4', '5', '6'],
        correct: '4'
      },
      {
        question: 'Jaka jest pierwiastek kwadratowy z 9?',
        answers: ['2', '3', '4', '5'],
        correct: '3'
      }
    ]
  },
  {
    category: 'Historia',
    questions: [
      {
        question: 'W którym roku wybuchła II wojna światowa?',
        answers: ['1935', '1938', '1939', '1941'],
        correct: '1939'
      },
      {
        question: 'Kto był pierwszym prezydentem Stanów Zjednoczonych?',
        answers: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'],
        correct: 'George Washington'
      }
    ]
  },
  {
    category: 'Twierdza: Edycja Ostateczna',
    questions: [
      {
        question: 'W którym roku została wydana gra "Twierdza: Edycja Ostateczna"?',
        answers: ['2010', '2012', '2014', '2016'],
        correct: '2016'
      },
      {
        question: 'Jaki jest główny cel w grze "Twierdza: Edycja Ostateczna"?',
        answers: [
          'Budowanie i rozbudowa twierdzy',
          'Zbieranie zasobów',
          'Walcz z przeciwnikami',
          'Wszystkie powyższe odpowiedzi'
        ],
        correct: 'Wszystkie powyższe odpowiedzi'
      }
    ]
  },
  {
    category: 'Gry',
    questions: [
      {
        question: 'W jakim roku została wydana gra "The Legend of Zelda: Breath of the Wild"?',
        answers: ['2015', '2016', '2017', '2018'],
        correct: '2017'
      },
      {
        question: 'Która gra zdobyła tytuł "Gra Roku" na The Game Awards 2020?',
        answers: [
          'The Last of Us Part II',
          'Hades',
          'Animal Crossing: New Horizons',
          'Doom Eternal'
        ],
        correct: 'The Last of Us Part II'
      },
      {
        question: 'Która firma jest odpowiedzialna za stworzenie serii gier "The Elder Scrolls"?',
        answers: ['Bioware', 'Bethesda Game Studios', 'Ubisoft', 'CD Projekt'],
        correct: 'Bethesda Game Studios'
      }
    ]
  },
  {
    category: 'Ogólne',
    questions: [
      {
        question: 'Która planeta jest znana jako "Czerwona Planeta"?',
        answers: ['Mars', 'Jowisz', 'Wenus', 'Saturn'],
        correct: 'Mars'
      },
      {
        question: 'Ile wynosi pierwiastek kwadratowy z liczby 16?',
        answers: ['2', '4', '8', '16'],
        correct: '4'
      },
      {
        question: 'Które zwierzę jest największe na świecie?',
        answers: ['Słoń', 'Wieloryb błękitny', 'Żyrafa', 'Hipopotam'],
        correct: 'Wieloryb błękitny'
      },
      {
        question: 'W którym roku odbyła się pierwsza podróż człowieka na Księżyc?',
        answers: ['1964', '1969', '1975', '1982'],
        correct: '1969'
      },
      {
        question: 'Który kraj jest największym producentem kawy na świecie?',
        answers: ['Brazylia', 'Wietnam', 'Kolumbia', 'Etiopia'],
        correct: 'Brazylia'
      },
      {
        question: 'Ile kontynentów jest na Ziemi?',
        answers: ['4', '5', '6', '7'],
        correct: '7'
      },
      {
        question: 'Która rzeka jest najdłuższą na świecie?',
        answers: ['Nil', 'Amazonka', 'Jangcy', 'Missisipi'],
        correct: 'Nil'
      },
      {
        question: 'Kto napisał "Romeo i Julia"?',
        answers: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'Fyodor Dostoevsky'],
        correct: 'William Shakespeare'
      },
      {
        question: 'Która planeta jest najbliższa Słońcu?',
        answers: ['Merkury', 'Wenus', 'Mars', 'Jowisz'],
        correct: 'Merkury'
      },
      {
        question: 'Które zwierzę jest symbolizowane przez znak zodiaku Lew?',
        answers: ['Kot', 'Pies', 'Lew', 'Tygrys'],
        correct: 'Lew'
      },
      {
        question: 'W którym roku rozpoczęła się II wojna światowa?',
        answers: ['1935', '1938', '1939', '1941'],
        correct: '1939'
      },
      {
        question: 'Ile wynosi pierwiastek kwadratowy z liczby 25?',
        answers: ['3', '5', '7', '9'],
        correct: '5'
      },
      {
        question: 'Które morze leży pomiędzy Europą a Afryką?',
        answers: ['Morze Śródziemne', 'Morze Czarne', 'Morze Północne', 'Morze Bałtyckie'],
        correct: 'Morze Śródziemne'
      },
      {
        question: 'Kto był pierwszym prezydentem Stanów Zjednoczonych?',
        answers: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'],
        correct: 'George Washington'
      },
      {
        question: 'Które państwo jest największe pod względem powierzchni na świecie?',
        answers: ['Rosja', 'Kanada', 'Chiny', 'Stany Zjednoczone'],
        correct: 'Rosja'
      },

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const commands = [
  new SlashCommandBuilder()
    .setName('quiz_start')
    .setDescription('Rozpocznij quiz')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`Bot ${client.user.tag} is ready!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'quiz_start') {
    await interaction.reply('Rozpoczynamy quiz! Aby dołączyć, kliknij przycisk poniżej.');

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('join_button')
          .setLabel('Dołącz')
          .setEmoji('👍')
          .setStyle('PRIMARY'),
      );

    await interaction.followUp({ content: 'Zapisy trwają przez 60 sekund.', components: [row] });

    const filter = i => i.customId === 'join_button' && !i.user.bot;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on('collect', i => {
      interaction.followUp(`Dołączył(a): ${i.user.username}`);
    });

    collector.on('end', collected => {
      interaction.followUp(`Zapisy zakończone! Uczestnicy: ${collected.map(i => i.user.username).join(', ')}`);
      startQuiz(interaction.channel);
    });
  }
});

async function startQuiz(channel) {
  const quiz = quizzes[currentQuestionIndex];

  if (currentQuestionIndex < quizzes.length) {
    const question = quiz.questions[0];
    const shuffledAnswers = shuffleArray(question.answers);

    const questionEmbed = new MessageEmbed()
      .setTitle(`Kategoria: ${quiz.category}`)
      .setDescription(question.question)
      .addField('Odpowiedzi', shuffledAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n'))
      .setColor('#3498db');

    await channel.send({ embeds: [questionEmbed] });

    const filter = i => {
      const choice = parseInt(i.customId);
      return !isNaN(choice) && choice > 0 && choice <= shuffledAnswers.length && quizParticipants.has(i.user.id);
    };

    const collector = channel.createMessageComponentCollector({
      filter,
      time: 30000,
    });

    collector.on('collect', async i => {
      const userChoice = parseInt(i.customId);
      const correctIndex = question.answers.indexOf(question.correct);
      const participant = quizParticipants.get(i.user.id);

      if (userChoice === correctIndex + 1) {
        await channel.send(`Brawo! ${i.user.username} udzielił(a) poprawnej odpowiedzi!`);
        participant.score++;
      } else {
        await channel.send(`Niestety, odpowiedź niepoprawna, ${i.user.username}. Prawidłowa odpowiedź to: ${question.correct}`);
      }

      currentQuestionIndex++;
      await collector.stop();
      startQuiz(channel);
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        channel.send('Czas na udzielenie odpowiedzi minął.');
        currentQuestionIndex++;
        startQuiz(channel);
      }
    });

  } else {
    const sortedParticipants = Array.from(quizParticipants.entries()).sort((a, b) => b[1].score - a[1].score);

    const resultsEmbed = new MessageEmbed()
      .setTitle('Wyniki Quizu')
      .setColor('#3498db');

    sortedParticipants.forEach(([userId, participant], index) => {
      resultsEmbed.addField(`${index + 1}. <@${userId}>`, `${participant.score} punktów`);
    });

    await channel.send({ embeds: [resultsEmbed] });

    quizActive = false;
    quizParticipants.clear();
    currentQuestionIndex = 0;
  }
}

function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
