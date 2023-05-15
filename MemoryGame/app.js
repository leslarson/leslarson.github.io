// The creative, visual side of web development has always been
// very difficult for me. I could have worked much longer, to make this look like a 
// "real" game, but for the purposes of the exercise, I chose function over form.

const colors = ["red", "red", "blue", "blue", "green", "green", "yellow", "yellow", "purple", "purple"];
let allowClicks = 2;
let firstCard = null;
let firstColor = "";
let pairsInPlay = 5;
const container = document.querySelector("#container");

container.addEventListener("click", function (evt) {
  gameLogic(evt.target);
});

function initializeCards() {
    // I know there is an algorithm, Fisher-Yates, for shuffling an array
    // but since this is a programming lesson, I didn't think it would be
    // appropriate to use unoriginal work. Hence the process here.
    for (let i = 1; i <= 10; i++) {
        let pick = Math.floor(Math.random() * colors.length);
        const newCard = document.createElement("div");
        newCard.setAttribute("data-color", colors[pick]);

        // data-allow means the card is still in play
        newCard.setAttribute("data-allow", 0);
        newCard.classList.add("card");
        newCard.style.backgroundColor = "lightgray";
        container.appendChild(newCard);
        colors.splice(pick, 1);
    }

}

function gameLogic(target) {
    // if there are no cards up, turn one up.
    // if there is one card up, show another
    // if click on the same card, ignore click ('data-up' is present)
    // if they match, remove 'data-allow' on both, move on.
    // if no match, setInterval for 1 sec (no other cards will respond
    // to clicks because allowCards=0 at this time)

    if (allowClicks && target.hasAttribute("data-allow") && !target.hasAttribute("data-up")) {
        target.style.backgroundColor = target.getAttribute("data-color");
        allowClicks--;
        if (allowClicks) {
            // mark this as the first card up
            firstCard = target;
            firstCard.setAttribute("data-up", 0);
            return;
        }
        // Two cards are up... do they match?
        if (firstCard.getAttribute("data-color") === target.getAttribute("data-color")) {
            cardsMatch(target);
        } else {
            delayPlay(target);
        }
    }
}

function cardsMatch(target) {
    target.style.backgroundColor = target.getAttribute("data-color");
    pairsInPlay--;
    if (pairsInPlay) {
        firstCard.removeAttribute("data-up");
        firstCard.removeAttribute("data-allow");
        target.removeAttribute("data-allow");
        allowClicks = 2;
    } else {
        // game ends
        // if I just alert, with no delay, the second card doesn't 
        // show properly before the alert, and that just looks
        // sort of sloppy.
        let gameOver = setInterval(function () {
          alert("Game Over");
          clearInterval(gameOver);
        }, 250);
    }
}

function delayPlay(target) {
    const delayId = setInterval(function () {
        firstCard.style.backgroundColor = "lightgray";
        firstCard.removeAttribute("data-up");
        target.style.backgroundColor = "lightgray";
        allowClicks = 2;
        clearInterval(delayId);
    }, 1000);
}

initializeCards();
