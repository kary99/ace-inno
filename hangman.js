// import confetti from "./confetti.js";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

let words = [
    "algorithm",
    "robot",
    "intelligence",
    "cognitive",
    "prediction",
    "deepfake",
    "chatbot",
    "virtual",
    "sensor",
    "assistant",
    "perception",
    "augmented",
    "decision",
    "analytic",
    "turing",
    "pytorch",
    "generativeai",
    "innovation",
	"clustering",
	"sematicai", 
	"copilot" 
];

let wordhints = [
    {word: "algorithm", hint: "Hint: A set of rules or instructions for solving a problem or achieving a goal"},
    {word: "robot", hint: "Hint: A machine capable of carrying out a complex series of actions automatically"}, 
    {word: "intelligence", hint: "Hint: The ability to acquire and apply knowledge and skills"}, 
    {word: "cognitive", hint: "Hint: Related to processes of thought, such as perception, memory, and reasoning"}, 
    {word: "prediction", hint: "Hint: The act of estimating or forecasting future events or outcomes"}, 
    {word: "deepfake", hint: "Hint: A synthetic media in which a person in an existing image or video is replaced with someone else's likeness"}, 
    {word: "chatbot", hint: "Hint: A computer program designed to simulate conversation with human users"}, 
    {word: "virtual", hint: "Hint: Existing or occurring on a computer or on the internet"}, 
    {word: "sensor", hint: "Hint: A device that detects or measures physical properties and sends signals to a computer"}, 
    {word: "assistant", hint: "Hint: A person or software program that provides help or support"}, 
    {word: "perception", hint: "Hint: The process of recognizing and interpreting sensory stimuli"}, 
    {word: "augmented", hint: "Hint: Having been made greater in size or value"}, 
    {word: "decision", hint: "Hint: A conclusion or resolution reached after consideration"}, 
    {word: "analytic", hint: "Hint: Relating to or using logical analysis and reasoning"}, 
    {word: "turing", hint: "Hint: Pioneer in computer science, known for the Turing Test and contributions to AI"}, 
    {word: "pytorch", hint: "Hint: An open-source machine learning library for Python"}, 
    {word: "generativeai", hint: "Hint: AI techniques that create new content, such as images, text, or music"}, 
    {word: "innovation", hint: "Hint: The introduction of something new or a new idea, method, or device"}, 
    {word: "clustering", hint: "Hint: The process of grouping similar items together in a set"}, 
    {word: "semanticai", hint: "Hint: AI focused on understanding the meaning of words and sentences in a language"}, 
    {word: "copilot", hint: "Hint: An AI-powered assistant designed to help developers write code"}
];


// ============================================================
// Changing height of main div in getRndWord on w=768px if letters exceeds 7
const winWidth = window.innerWidth;

// adding listener to each key
let keyboardBtns = document.querySelectorAll(".keyboard-btn");
keyboardBtns.forEach((key) => {
    key.addEventListener("click", () => play(key.getAttribute("id")));
});

const tries_div = document.querySelector(".tries");
const start_button = document.querySelector("#start");
const main = document.querySelector(".main");
const main_div = document.querySelector(".inner-main");
const img = document.querySelector("#hangman");
const startGame = document.querySelector("#start-game");
let blocks = null;
let dupWord = [];
let word = [];
let tries = 0;
let totalTries = null;
let firstTime = true;
let thisword = ""

// Modals
const hintModal = document.querySelector("#modal-hint");
const tries0Modal = document.querySelector("#modal-tries0");
const winModal = document.querySelector("#modal-win");
const loseModal = document.querySelector("#modal-lose");
const secretWord = document.querySelector("#secret-word");
const aboutModal = document.querySelector("#modal-about");
// starting script
disableBtns();

start_button.addEventListener("click", () => {
    disableStart();
    enableBtns();
    clearFails();
    clearMainDiv();
    genWrdBlocks();
    setTries();
    displayHint();
    // document.getElementById("hint").style.display = "inline-block";
});

function play(id) {
    if (tries > 0) {
        let match = word.includes(id);
        let res = 1;
        if (match) {
            blocks.forEach((block) => {
                if (
                    !block.classList.contains("visible") &&
                    block.textContent === id &&
                    res >= 1
                ) {
                    block.classList.add("visible");
                    res -= 1;
                }
            });
            word.splice(word.indexOf(id), 1);
        } else if (!match) {
            document.querySelector(`#${id}`).classList.add("fail");
            document.querySelector(`#${id}`).disabled = true;
            decTries();
            document.querySelector(
                ".tries"
            ).innerHTML = `${tries} out of ${totalTries} tries left`;
            setImg();
        }
    }
    winLose();
}

// utility functions

// =========================================

function displayHint(){
    console.log(dupWord.join(""));
    const currentWord = dupWord.join("");
    const hintObj = getHint(currentWord);

    if (hintObj) {
        document.getElementById("hint-text").innerText = hintObj.hint;
    } else {
        // If hint not found, display a default message
        document.getElementById("hint-text").innerText = "Hint not available for this word";
    }
}
function getHint(word) {
    const hint = wordhints.find(item => item.word == word);
    return hint
}

function getRnd(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
}

function getRndWord() {
    let word = words[getRnd(0, words.length - 1)].split("");
    if (word.length >= 7 && winWidth <= 768) {
        main.style.height = "140px";
    }

    let final_word = word.filter(item => item.trim() !== '');
    return final_word;
}

function genWrdBlocks() {
    word = getRndWord();
    console.log(word);
    dupWord = [...dupWord, ...word];

    // create divs in dom
    word.forEach((letter) => {
        let div = document.createElement("div");
        div.classList.add(`main-block`);
        div.classList.add(`val-${letter}`);
        div.innerHTML = letter;
        main_div.appendChild(div);
    });
    blocks = document.querySelectorAll(".main-block");
}

// =========================================

function resetAll() {
    tries = 0;
    document.querySelector(".tries").innerHTML = "";
    startGame.innerHTML = "Play Again";
    img.src = "./assets/images/0.png";
    word = [];
    dupWord = [];
    clearFails();
    clearMainDiv();
    enableStart();
    document.getElementById("hint-text").innerText = "";
}

function clearFails() {
    for (let i = 97; i < 123; i++) {
        document
            .querySelector(`#${String.fromCharCode(i)}`)
            .classList.remove("fail");
    }
}

function clearMainDiv() {
    main_div.innerHTML = "";
}

function setImg() {
    let percent = (tries / totalTries) * 100;
    if (percent > 71.5 && percent <= 87.75) {
        img.src = "./assets/images/1.png";
    } else if (percent > 57.25 && percent <= 71.5) {
        img.src = "./assets/images/2.png";
    } else if (percent > 43 && percent <= 57.25) {
        img.src = "./assets/images/3.png";
    } else if (percent > 28.75 && percent <= 43) {
        img.src = "./assets/images/4.png";
    } else if (percent > 14.5 && percent <= 28.75) {
        img.src = "./assets/images/5.png";
    } else if (percent <= 14.5) {
        img.src = "./assets/images/6.png";
    }
}

function setTries() {
    tries = word.length;
    totalTries = word.length;
    tries_div.innerHTML = `${tries} out of ${totalTries} tries left`;
}

function decTries() {
    tries -= 1;
}

function disableStart() {
    start_button.disabled = true;
    start_button.classList.add("start-fail");
}

function enableStart() {
    start_button.disabled = false;
    start_button.classList.remove("start-fail");
}

function disableBtns() {
    for (let i = 97; i < 123; i++) {
        document.querySelector(`#${String.fromCharCode(i)}`).disabled = true;
    }
    // document.querySelector(".hint").disabled = true;
}

function enableBtns() {
    for (let i = 97; i < 123; i++) {
        document.querySelector(`#${String.fromCharCode(i)}`).disabled = false;
    }
    // document.querySelector(".hint").disabled = false;
}

function winLose() {
    if (tries === 0) {
        secretWord.innerHTML = `secret word was "${dupWord.join("")}"`;
        openLose();
        setTimeout(() => {
            closeLose();
            resetAll();
            disableBtns();
        }, 2500);
    } else if (
        document.querySelectorAll(".visible").length === dupWord.length
    ) {
        confetti({
            particleCount: 200,
            scalar: 1.175,
            angle: 60,
            gravity: 0.75,
            spread: 70,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 200,
            scalar: 1.175,
            angle: 120,
            gravity: 0.75,
            spread: 70,
            origin: { x: 1 },
        });
        openWin();
        resetAll();
        disableBtns();
        setTimeout(() => {
            closeWin();
        }, 3000);
    }
}

// ================== Modal Functions =====================
// Modal Toggle
function openHint() {
    hintModal.showModal();
}
document.querySelector("#close-hint").addEventListener("click", closeHint);
function closeHint() {
    hintModal.close();
}
function openTries0() {
    tries0Modal.showModal();
}
function closeTries0() {
    tries0Modal.close();
}
function openWin() {
    winModal.showModal();
}
function closeWin() {
    winModal.close();
}
function openLose() {
    loseModal.showModal();
}
function closeLose() {
    loseModal.close();
}
document.querySelector("#open-about").addEventListener("click", () => {
    aboutModal.showModal();
});
document.querySelector("#close-about").addEventListener("click", () => {
    aboutModal.close();
});
// Modal Actions

document
    .querySelector("#take-hint")
    .addEventListener("click", setFirtTimeFalse);
function setFirtTimeFalse() {
    /** on taking hint */
    firstTime = false;
    closeHint();
    hint();
}