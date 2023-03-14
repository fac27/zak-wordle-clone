import { words } from './words.js';

const randomWord = words[Math.floor(Math.random() * words.length)];

// record key enteries
const containerDivs = document.querySelectorAll('div');

let won = false;
let lost = false;
let word = '';

const re = /^[a-z]+$/;
const guesses = [];
const usedDivs = [];

document.addEventListener('keydown', (e) => {
  // make sure user haven't lost or won yet
  if (guesses.length < 6 && !won) {
    // remove the buzz-out class first so containers move each wrong guess
    usedDivs.slice(-5).forEach((div) => {
      div.classList.remove('buzz-out-on-hover');
    });

    // record word entry
    if (word.length < 5 && re.test(e.key)) {
      word += e.key;

      for (let div of Array.from(containerDivs)) {
        if (div.textContent === '') {
          div.textContent = e.key;
          usedDivs.push(div);

          break;
        }
      }
    }

    //   check word is valid
    if (word.length === 5 && e.key === 'Enter') {
      if (words.includes(word)) {
        guesses.push(word);
        colorizeDivs(usedDivs.slice(-5), checkGuess(randomWord, word));

        word = '';
      } else {
        const buzzerSound = new Audio('./assets/buzzer.wav');
        buzzerSound.play();

        usedDivs.slice(-5).forEach((div) => {
          div.classList.add('buzz-out-on-hover');
        });
      }
    }

    // handle backspaces to erase a letter
    if (e.key === 'Backspace') {
      eraseLetter(usedDivs.slice(-1));
    }
  } else {
    lost = true;
    return;
  }
});

// ----------------
const checkGuess = (correctWord, guessWord) => {
  const correctLettersAndPositions = [];
  const correctLetters = [];
  const incorrectLetters = [];

  for (let letter of guessWord) {
    if (correctWord.includes(letter)) {
      if (correctWord.indexOf(letter) === guessWord.indexOf(letter)) {
        correctLettersAndPositions.push(letter);
      } else {
        correctLetters.push(letter);
      }
    } else {
      incorrectLetters.push(letter);
    }
  }

  return [correctLettersAndPositions, correctLetters, incorrectLetters];
};

// ----------------
const colorizeDivs = (divs, guessedLetters) => {
  const [correctLettersAndPositions, correctLetters] = guessedLetters;

  // user has got all 5 correct letters - won the game.
  if (correctLettersAndPositions.length === 5) {
    won = true;

    const correctSound = new Audio('./assets/correct.wav');
    correctSound.play();
  }

  divs.forEach((div) => {
    if (correctLettersAndPositions.includes(div.textContent)) {
      div.classList.add('correct');
    } else if (correctLetters.includes(div.textContent)) {
      div.classList.add('close');
    } else {
      div.classList.add('incorrect');
    }

    div.classList.add('done');
  });
};

// ----------------
const eraseLetter = (div) => {
  if (div.length > 0) {
    if (!Array.from(div[0].classList).includes('done')) {
      div[0].textContent = '';

      usedDivs.pop();
      word = word.slice(0, -1);
    }
  }
};
