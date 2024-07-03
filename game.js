/ --------- element selector ---------
const storeSfx = document.querySelector("#store-sfx");
const buttonSfx = document.querySelector("#button-sfx");
const bgm = document.querySelector("#bgm");
const startButton = document.querySelector(".start");
const startWindow = document.querySelector(".start-window");
const currentGoal = document.querySelector(".current-goal");
const currentDay = document.querySelector(".current-day");
const resultWindow = document.querySelector("#result-window");
const continueButton = document.querySelector("#continue");
const restartButton = document.querySelector("#restart");
const timerElement = document.querySelector("#timer");
const displayResult = document.querySelector("#result-window");
const goodSfx = document.querySelector("#good-sfx");
const badSfx = document.querySelector("#bad-sfx");
const cashSfx = document.querySelector("#cash-sfx");
const mistakeSfx = document.querySelector("#mistake-sfx");
const targetMoneyCounter = document.querySelector("#ingame-earning");
const targetDayCounter = document.querySelector("#day");
const targetResultCounter = document.querySelector(".total-earnings");
const winLoseOutput = document.querySelector(".outcome");
const guideWindow = document.querySelector(".guide-window");

// --------- global variables and starting state of game ---------
let computerSequence = [];
let playerSequence = [];
let playerCanInput = false;
let currentIndex = 0;
let duration = 60;
let isGuideWindowVisible = false;
guideWindow.style.visibility = "hidden";
displayResult.style.visibility = "hidden";
// player earnings
let totalMoneyEarn = 0;
const refund = 10;
const customerPays = 15;
// how much player needs to earn
let day = 1;
let currentEarningsNeeded = 30;
const ingredients = ["salmon", "tuna", "wasabi", "ebi", "tamago", "ikura"];

// --------- key bindings ---------
document.addEventListener("keydown", function (e) {
    if (e.code === "KeyH") {
        buttonSfx.play();
        if (isGuideWindowVisible) {
            guideWindow.style.visibility = "hidden";
        } else {
            guideWindow.style.visibility = "visible";
        }

        isGuideWindowVisible = !isGuideWindowVisible;
    }

    if (playerCanInput === true) {
        handleUserInput(e);
    }
});

function handleUserInput(e) {
    if (e.code === "KeyA") {
        playerSequence.push("tuna");
        buttonSfx.play();
        imageOfInput("assets/tuna.svg", currentIndex++);
    } else if (e.code === "KeyW") {
        buttonSfx.play();

        playerSequence.push("salmon");
        imageOfInput("assets/salmon.svg", currentIndex++);
    } else if (e.code === "KeyD") {
        buttonSfx.play();
        playerSequence.push("wasabi");
        imageOfInput("assets/wasabi.svg", currentIndex++);
    } else if (e.code === "KeyJ") {
        buttonSfx.play();
        playerSequence.push("tamago");
        imageOfInput("assets/tamago.svg", currentIndex++);
    } else if (e.code === "KeyI") {
        buttonSfx.play();
        playerSequence.push("ikura");
        imageOfInput("assets/ikura.svg", currentIndex++);
    } else if (e.code === "KeyL") {
        buttonSfx.play();
        playerSequence.push("ebi");
        imageOfInput("assets/ebi.svg", currentIndex++);
    }
    if (e.code === "Backspace") {
        currentIndex = 0;
        mistakeSfx.play();
        playerSequence.length = 0;
        // Remove images
        document.querySelectorAll(".dish-image").forEach((img) => img.remove());
        if (duration <= 5) {
            duration = 0;
        } else {
            duration -= 5;
        }
    } else if (e.code === "Enter") {
        submitDish(playerSequence, computerSequence);
        currentIndex = 0;
        // Remove images
        document.querySelectorAll(".dish-image").forEach((img) => img.remove());
    }
    console.log(playerSequence);
}

// --------- Game Starts Here ---------

// START GAME WINDOW
currentGoal.innerText = "$" + currentEarningsNeeded + ".00";
let timerDisplay = null;
function stopWatchForTimer() {
    timerDisplay = setInterval(() => {
        updateTimer();
    }, 1000);
}

// click start button
startButton.addEventListener("click", function (e) {
    startWindow.style.visibility = "hidden";

    duration = 60;
    stopWatchForTimer();
    updateTimer();
    randomIngredients();
    playerCanInput = true;

    // reset past inputs for player and comp
    currentIndex = 0;
    document.querySelectorAll(".dish-image").forEach((img) => img.remove());
    playerSequence.length = 0;

    storeSfx.play();
    buttonSfx.play();
    bgm.play();
});

// timer function (to change timer duration => change value of duration variable)
function updateTimer() {
    const minutes = Math.floor(duration / 60);
    let seconds = duration % 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    } else {
        seconds = seconds;
    }

    timerElement.innerText = minutes + ":" + seconds;

    duration--;

    if (duration < 0) {
        // what happens timer ends
        clearInterval(timerDisplay);
        playerCanInput = false;
        duration = 0;
        playerWinOrLose(totalMoneyEarn, currentEarningsNeeded);
        displayResult.style.visibility = "visible";

        storeSfx.play();
    }
}

// random computer sequence generator
function randomIngredients() {
    computerSequence.length = 0;
    for (let i = 0; i < 6; i++) {
        const getRandomIngredient =
            ingredients[Math.floor(Math.random() * ingredients.length)];
        computerSequence.push(getRandomIngredient);
        const itemOrder = document.querySelector(`.comp-${i + 1}`);
        itemOrder.innerText = getRandomIngredient;
    }
}

// add image based on player inputs
function imageOfInput(playerDish, index) {
    const dishSelected = document.querySelector(`.item-${index + 1}`);
    // Remove previous image if exists
    dishSelected.querySelectorAll("img").forEach((img) => img.remove());
    const dishImage = document.createElement("img");
    dishImage.src = playerDish;
    // Add a class to identify these images for removal
    dishImage.classList.add("dish-image");
    dishSelected.append(dishImage);
}

// check to see if player input is correct or not
function submitDish(playerDish, computerDish) {
    if (playerDish.length !== computerDish.length) {
        totalMoneyEarn -= refund;
        playerSequence.length = 0;
        updateMoneyCounter();

        badSfx.play();
        return;
    } else {
        for (let i = 0; i < playerDish.length; i++) {
            if (playerDish[i] !== computerDish[i]) {
                totalMoneyEarn -= refund;
                playerSequence.length = 0;
                updateMoneyCounter();

                badSfx.play();
                return;
            }
        }
        totalMoneyEarn += customerPays;
        playerSequence.length = 0;
        randomIngredients();
        updateMoneyCounter();

        cashSfx.play();
        goodSfx.play();
    }
}

// TOP LEFT COUNTERS AND RESULT COUNTERS
// update counters
function updateMoneyCounter() {
    // counter during game
    targetMoneyCounter.innerText = "$" + totalMoneyEarn + ".00";
    // counter for result
    targetResultCounter.innerText = "$" + totalMoneyEarn + ".00";
}

function updateDayCounter() {
    // counter during game
    targetDayCounter.innerText = "Day: " + day;
    // counter for result
    targetResultCounter.innerText = "$" + totalMoneyEarn;
}

// check to see if player win or lose
function playerWinOrLose(totalEarning, totalNeeded) {
    if (totalEarning >= totalNeeded) {
        continueButton.disabled = false;
        restartButton.disabled = true;
        winLoseOutput.innerText = "You managed well! You can open again tomorrow.";
        winLoseOutput.style.color = "#51a65e";
        targetResultCounter.style.color = "#51a65e";
    } else if (totalEarning < totalNeeded) {
        continueButton.disabled = true;
        restartButton.disabled = false;
        winLoseOutput.innerText = "Uh-oh! Game over. Time to close shop...";
        winLoseOutput.style.color = "#e33030";
        targetResultCounter.style.color = "#e33030";
    }
}

// RESULT WINDOW

// click restart button
restartButton.addEventListener("click", function (e) {
    resultWindow.style.visibility = "hidden";
    // startWindow pops up once button is clicked
    startWindow.style.visibility = "visible";
    restartGame();

    buttonSfx.play();
});

// click continue button
continueButton.addEventListener("click", function (e) {
    resultWindow.style.visibility = "hidden";
    // startWindow pops up once button is clicked
    startWindow.style.visibility = "visible";
    nextRound();

    buttonSfx.play();
});

// next round
function nextRound() {
    // update variables
    currentEarningsNeeded += 15;
    day++;
    totalMoneyEarn = 0;

    // update top left counters accordingly
    updateDayCounter();
    updateMoneyCounter();

    // what is going to be shown in startWindow
    currentGoal.innerText = "$" + currentEarningsNeeded + ".00";
    currentDay.innerText = "Day " + day;
}

// restart round
function restartGame() {
    // update variables
    currentEarningsNeeded = 30;
    day = 1;
    totalMoneyEarn = 0;

    // update top left counters accordingly
    updateDayCounter();
    updateMoneyCounter();

    // what is going to be shown in startWindow
    currentGoal.innerText = "$" + currentEarningsNeeded + ".00";
    currentDay.innerText = "Day " + day;
}
