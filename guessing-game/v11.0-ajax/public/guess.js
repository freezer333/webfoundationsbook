const mask = (showStart, showGuess, showComplete) => {
    document.querySelector(".guess-instructions").style.display = showStart ? "block" : "none";
    document.querySelector(".guess-feedback").style.display = showGuess ? "block" : "none";
    document.querySelector("#guess").style.display = (showStart || showGuess) ? "block" : "none";
    document.querySelector("#complete").style.display = showComplete
        ? "block"
        : "none";
};

const init = () => {
    mask(true, false, false);
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => button.addEventListener("click", make_guess));
    const guessList = document.querySelector("ul.guess-list");
    while (guessList.firstChild) {
        guessList.removeChild(guessList.firstChild);
    }
};

const make_guess = (event) => {
    const inputElement = event.target.previousElementSibling;
    if (inputElement && inputElement.tagName === "INPUT") {
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ guess: inputElement.value }),
        })
            .then((response) => response.json())
            .then((data) => {
                inputElement.value = "";

                if (data.correct) {
                    document.querySelector("span.secret").innerText = `${inputElement.value} `;
                    document.querySelector("span.number-of-guesses").innerText = data.num_guesses;
                    mask(false, false, true);
                }
                else {
                    document.querySelector("span.response").innerText = data.message;
                    const guessList = document.querySelector("ul.guess-list");
                    const newListItem = document.createElement("li");
                    if (data.message.includes("high")) {
                        newListItem.className = "rounded-section high";
                        newListItem.innerText = `${inputElement.value} too high`;
                    } else {
                        newListItem.className = "rounded-section low";
                        newListItem.innerText = `${inputElement.value} too low`;
                    }
                    guessList.appendChild(newListItem);
                    mask(false, true, false);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        return;
    }
};
document.addEventListener("DOMContentLoaded", init);
