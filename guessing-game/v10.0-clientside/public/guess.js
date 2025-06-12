let secret;
let guesses = [];

const mask = (showStart, showGuess, showComplete) => {
  document.getElementById("start").style.display = showStart ? "block" : "none";
  document.getElementById("guess").style.display = showGuess ? "block" : "none";
  document.getElementById("complete").style.display = showComplete
    ? "block"
    : "none";
};

const init = () => {
  console.log("Initialize the game");
  guesses = [];
  const guessList = document.querySelector("ul.guess-list");
  while (guessList.firstChild) {
    guessList.removeChild(guessList.firstChild);
  }
  secret = Math.floor(Math.random() * 10) + 1;
  console.log("Secret = ", secret);

  mask(true, false, false);
};

const make_guess = (event) => {
  const inputElement = event.target.previousElementSibling;
  if (inputElement && inputElement.tagName === "INPUT") {
    const inputValue = inputElement.value;
    if (inputValue > secret) {
      document.getElementById("sorry_message").innerText =
        `Sorry, ${inputValue} was too high`;
      const guessList = document.querySelector("ul.guess-list");
      const newListItem = document.createElement("li");
      newListItem.className = "rounded-section high";
      newListItem.innerText = `${inputValue} too high`;
      guessList.appendChild(newListItem);
      guesses.push({ guess: inputValue, result: "high" });
      mask(false, true, false);
    } else if (inputValue < secret) {
      document.getElementById("sorry_message").innerText =
        `Sorry, ${inputValue} was too low`;
      const guessList = document.querySelector("ul.guess-list");
      const newListItem = document.createElement("li");
      newListItem.className = "rounded-section low";
      newListItem.innerText = `${inputValue} too low`;
      guessList.appendChild(newListItem);
      guesses.push({ guess: inputValue, result: "low" });
      mask(false, true, false);
    } else {
      console.log("Guess was perfect!");
      guesses.push({ guess: inputValue, result: "correct" });
      document.getElementById("success_message").innerText =
        `${inputValue} was the number!`;
      document.getElementById("count_message").innerText =
        `You needed ${guesses.length} guesses.`;
      mask(false, false, true);
    }
    inputElement.value = "";
  }
};
